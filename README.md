<p align="center">
    <img width="100px" src="https://github.com/aleganza/akuse/blob/main/assets/img/icon/icon.png"/>
    <h1 align="center">Akuse</h1>
</p>

<p align="center">Simple and easy to use anime streaming desktop app without ads.</p>

<p align="center">
    <img alt="license" src="https://img.shields.io/github/license/aleganza/akuse"> 
    <img alt="GitHub release (with filter)" src="https://img.shields.io/github/v/release/akuse-app/akuse">
    <img alt="total-downloads" src="https://img.shields.io/github/downloads/aleganza/akuse/total">
    <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/aleganza/akuse?color=red">
    <a href="https://discord.gg/f3wdnqSNX5">
        <img alt="Discord" src="https://img.shields.io/discord/1163970236224118796?label=discord&color=%235567E3">
    </a>
</p>

<img title="img" alt="img" src="https://i.imgur.com/8IVaUfo.jpg">

## ⚙️ Running locally for development

Start cloning Akuse:

```
git clone https://github.com/akuse-app/Akuse.git
```

Next, go to [this link](https://anilist.co/settings/developer) and create a new AniList API Client.
As Redirect Uri, you can insert `akuse://index,https://anilist.co/api/v2/oauth/pin` (these are two space seprated uri) and it should work.
Now go inside the src/modules folder and create a clientData.js file with a structure like this:

```
module.exports = {
    clientId: ,
    redirectUri: "",
    redirectUriAppImage:"",
    clientSecret: ""
}
```

Fill it with the data retrieved from the creation of your AniList API Client.

```bash
# Example:
module.exports = {
    clientId: 12345,
    redirectUri: "akuse://index",
    redirectUriAppImage: "https://anilist.co/api/v2/oauth/pin",
    clientSecret: "iA04TKLO3k3LaVWhxucJwck0glR6uhiv"
}
```

Next, install its dependencies (make sure npm is installed on your machine):

```
npm install
```

To start, run:

```
npm start
```
## 🛠️ How to build

- [Linux read here](./LINUX_BUILD.md)

## ⚠ How to Log-In in development & AppImage

In development and AppImage, the Log-In redirect doesn't work since the app is not packed/installed and the Redirect Uri doesn't find it on your machine. If you need to work with an authenticated instance. 
### Follow  steps:
1. open the app using one of the method e.g.
    ```
    npm start
    ```
      OR
    ```
    ./path/to/app.AppImage
    ```
2. Now click on the login button and authenticate in the browser. you will get redirect to website like this:-

    ![1709734157317](image/README/1709734157317.png)

    copy this code in the input box and close the tab.
3. Now close the app and run it with flag `--login` followd by code e.g:- 
    - developement mode 
      ```js
        npm start -- --login def50200211627a77c5ecb3ac3f9eef26d955...........
      ```
    - AppImage
      ```js
        ./path/to/akuse.AppImage --login def50200211627a77c5ecb3ac3f9eef26d955...........
      ```
**NOTE:** This is not needed in Installed App.
## ⌨ Shortcuts

- Pages
  - F1: go to Discover page
  - F2: go to Library page
  - F3: go to Search page
- Video player
  - Space: play/pause video
  - Left arrow: fast rewind (5s)
  - Right arrow: fast forward (5s)
  - Upper arrow: increase volume
  - Lower arrow: decrease volume
  - F11: fullscreen toggler
  - F: fullscreen toggler
  - M: mute/unmute video
  - N: play next episode

## 🐛 Known Issues

- If Log-In doesn't work, make sure you have set a default browser.
- Some anime may don't work because of different names as compared to AniList: feel free to open a new issue if you find some of them so they can be fixed.

## 🌟 Contributors

[![](https://contrib.rocks/image?repo=akuse-app/akuse)](https://github.com/akuse-app/akuse/graphs/contributors)

## 🙌 Credits

- [Consumet API](https://github.com/consumet/consumet.ts): used to fetch episodes links
- [This API](https://api.ani.zip/mappings?anilist_id=21): used to fetch episodes info and thumbnails

## 📢 Disclaimer

- Akuse helps users find anime by simply scraping links from various websites.
- Akuse or its developers do not host the content found on Akuse. All images and anime information found in the app are retrieved from AniList public API.
- Additionally, all anime links found on Akuse are from various third party anime hosting websites.
- Akuse or its owner are not responsible for the misuse of any content inside or outside the app and shall not be responsible for the dissemination of any content within the app.
- By using this app, you agree that the app developer is not responsible for the content within the app. Nevertheless, they may or may not come from legitimate sources.
- For internet violations, please contact the source website. The developer is not legally responsible.

## 📜 License

Licensed under [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html#license-text).
