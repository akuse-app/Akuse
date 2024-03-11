'use strict'

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const DiscordRPC = require('discord-rpc-electron');
const Store = require('electron-store')
const AniListAPI = require('./modules/anilist/anilistApi.js')
const ProtocolUtils = require('./protocolUtils.js')
const clientData = require('./modules/clientData.js')
const { autoUpdater, AppUpdater } = require("electron-updater")
const icon = path.join(__dirname, "../assets/img/icon/icon.png")
const process = require('process')

const isAppImage = process.env.SNAP_NAME === undefined && process.env.FLATPAK_PATH === undefined && process.env.APPIMAGE !== undefined && process.env.APPIMAGE !== null;


const store = new Store()
const authUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientData.clientId}&redirect_uri=${(isAppImage||!(app.isPackaged))? clientData.redirectUriAppImage:clientData.redirectUri}&response_type=code`
const githubOpenNewIssueUrl = 'https://github.com/aleganza/akuse/issues/new'
autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true
autoUpdater.autoRunAppAfterInstall = true

let mainWin

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', async (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWin) {
            if (mainWin.isMinimized()) mainWin.restore()
            mainWin.focus()

        }

        // logged in
        try {   
            let code = commandLine[2].split('?code=')[1]
            await handleLogin(code);
            console.log('Logged In! Relaunching app...')
            //Reload the window instead of relaunching application.
            //Reason see comment on line no:122
            mainWin.reload()
            // app.relaunch()
            // app.exit()
        } catch (error) {
            console.log('something went wrong second-instance',error.message)
        }
        
    })

    // Create mainWin, load the rest of the app, etc...
    app.on('ready', () => { })
}

const createWindow = async() => {
    mainWin = new BrowserWindow({
        width: 1300,
        height: 850,
        minWidth: 1280,
        minHeight: 720,
        show: false,
        autoHideMenuBar: true,
        // titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#17191c',
            symbolColor: '#eee',
            height: 28
        },
        icon:icon ,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    for (let i = 0; i < process.argv.length; i++) {
      if (process.argv[i].startsWith('-')) {
        const flagName = process.argv[i];
        const flagValue = process.argv[i + 1] || ''; // Check for next element as value
        if(flagName=="--login"){
            console.log("STARTING LOGIN....")
            try {
                await handleLogin(flagValue)
                console.log("Loged In...")
            } catch (error) {
                console.log("login falied",error.message)
            }
        

        }
      }
    }
    mainWin.loadFile(__dirname + '/windows/index.html')
    mainWin.setBackgroundColor('#0c0b0b')

    mainWin.webContents.on('did-finish-load', () => {

        mainWin.show()
        mainWin.maximize()

        if (store.get('logged') !== true)
            store.set('logged', false)

        mainWin.webContents.send('load-app')
        autoUpdater.checkForUpdates()
    })
}

ipcMain.on('load-login-url', () => {
    require('electron').shell.openExternal(authUrl)
})

ipcMain.on('logout', () => {
    store.set('logged', false)
    store.clear('access_token')

    console.log('Logged Out! Relaunching app...')
    //Instead of Relaunching th Application Just reload the Window
    //This Provide More consistant cross-platform experience 
    //As sandboxed environment does not support relauch 
    //Beside that reload is more appropriate in this case because application only need's to read stored credential's
    mainWin.reload() 
    // app.relaunch()
    // app.exit()
})

ipcMain.on('load-issues-url', () => {
    require('electron').shell.openExternal(githubOpenNewIssueUrl)
})

app.whenReady().then(async() => {
    try {
        await createWindow()
    } catch (error) {
        console.log(error.message)
    }
    // app.setAsDefaultProtocolClient("akuse")

    ProtocolUtils.setDefaultProtocolClient(app);

    switch (process.platform) {
        case 'darwin':
            ProtocolUtils.setProtocolHandlerOSX(app);
            break;
        case 'linux':
        case 'win32':
            ProtocolUtils.setProtocolHandlerWindowsLinux(app);
            break;
        default:
            throw new Error('Process platform is undefined');
    }

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

/* AUTO UPDATING */

autoUpdater.on("update-available", (info) => {
    mainWin.webContents.send('auto-update')
    mainWin.webContents.send('update-available-info', info)
})

autoUpdater.on("update-downloaded", (info) => {
    autoUpdater.quitAndInstall()
})

autoUpdater.on('download-progress', (sender, data) => {
    mainWin.webContents.send('downloading', sender, data)
})

autoUpdater.on("error", (info) => {
    mainWin.webContents.send('message', info)
})

ipcMain.on('download-update', () => {
    let pth = autoUpdater.downloadUpdate()
})

/* CLOSING */

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})


async function handleLogin(code){
        mainWin.webContents.send("console-log", code)
        try {
            const cData = {
                clientId: clientData.clientId,
                redirectUri: (isAppImage||!(app.isPackaged))? clientData.redirectUriAppImage:clientData.redirectUri,
                clientSecret: clientData.clientSecret,
            }
            const anilist = new AniListAPI(cData)
            const token = await anilist.getAccessToken(code)
            mainWin.webContents.send("console-log", token)
            store.set('access_token', token)
            store.set('logged', true)
        } catch (error) {
            console.log("login failed with error: " + error.message);
        }

}

/* DISCORD RICH PRESENCE */

const clientId = '1212475013408628818';

DiscordRPC.register(clientId);

const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const startTimestamp = new Date();

async function setActivity() {
    if (!rpc || !mainWin) {
        return;
    }

    rpc.setActivity({
        details: 'Anime streaming desktop app',
        buttons: [
            {
                label: 'GitHub',
                url: 'https://github.com/akuse-app/Akuse'
            }
        ],
        startTimestamp,
        largeImageKey: 'icon',
        largeImageText: 'Akuse'
    });
}

rpc.on('ready', () => {
    setActivity();

    setInterval(() => {
        setActivity();
    }, 15e3);
});

rpc.login({ clientId }).catch(console.error);

