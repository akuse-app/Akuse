# 🛠️ Building for Linux 🐧

Before building for linux make sure to install dependency `libcrypt` on your system

### Debian base systems

```shell
sudo apt install libcrypt
```

### Fedora/RHL systems

```shell
sudo dnf install libxcrypt-compat
```

### AppImage

- use script `dist:linux` using following command

  ```shell
  npm run dist:linux AppImage
  ```

**Note:-** AppImage Support Login see `REAMDE.ME` for detail

## Deb

- deb also can be build using script `dist:linux` using following command

  ```shell
  npm run dist:linux deb
  ```

  **Note:-** DEB installation should support user login after installation (not yet tested).  Raise issue if login does not work for deb installations.

## Rpm

RPM build requires additional package `rpmbuild`. install it using your package manager.`<Br>`

### Dependecies installation:

- **Debian Distros** `<BR>`
  ```
  sudo apt install rpm-build  
  ```
- **Fedora/RHL** `<BR>`
  ```
  sudo dnf install rpm-build  
  ```

  **Read more about [rpm-build](https://linux.die.net/man/8/rpmbuild)**

### BUILD RPM

rpm installation can be created using dist:linux using following command

```shell
  npm run dist:linux rpm
```

  **Note:-** RPM installation support user login. Tested on

- OS: **Fedora Workstation 39**
- DE: GNOME 45.4

## Flatpak

- install `flatpak` && `flatpak-builder` for your operating system usign appropriate package manager.
- set appropriate `runtimeVersion` and `baseVersion` in `package.json`

  ```json
  {
  .......package.json stuff......
      "build":{
          .......other electron-builder stuff......
          "flatpak":{
              "runtimeVersion":"23.08",
             "baseVersion":"23.08"
          }
      }
  }
  ```
  **Note:-** if `runtimeVersion` and `baseVersion` are not set it will default to `20.08` which might not be installed on your system so check the version using following command and update the package.json accordingly.

  ```shell
  flatpak info runtime/org.freedesktop.Platform

  ```
  The output will look something like this

  ```
  Freedesktop Platform - Runtime platform for applications

            ID: org.freedesktop.Platform
           Ref: runtime/org.freedesktop.Platform/x86_64/23.08
          Arch: x86_64
        Branch: 23.08
       Version: 23.08.11
       License: MIT
        Origin: flathub
    Collection: org.flathub.Stable
  Installation: system
     Installed: 592.2 MB

        Commit: 329ad0f04e21dc3234accff013641299e13a9eb2f1b2908129692b4755393789
        Parent: 3c58ded6fa422d45d30b070f26e428617f6e6509d18cfa1c31f959494511da66
       Subject: Export org.freedesktop.Platform
          Date: 2024-02-05 13:19:29 +0000
  ```
  specify the version `23.08` (according to above output) as `runtimeVersion` .

  check baseVersion using the following command

  ```shell
  flatpak info app/org.electronjs.Electron2.BaseApp
  ```
  if you get error something like this

  ```
  error: No remote refs found for ‘app/org.electronjs.Electron2.BaseApp/x86_64/23.08’

  ```
  this means you did not have BaseApp install it using following command
- ````shell
  flatpak install flathub app/org.electronjs.Electron2.BaseApp
  ````
  then run the previous command again to check the version and set the `baseVersion`
- At last use the following command to build the flatpak

  ```shell
  npm run dist:linux flatpak
  ```
  **Note:-** if you get any error while building flatpak run this `env DEBUG='@malept/flatpak-bundler'` command and then run above command again to see detailed logs.
