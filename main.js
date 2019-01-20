const electron = require('electron')
const app = electron.app
require('electron-reload')(__dirname)

const BrowserWindow = electron.BrowserWindow

let mainWindow, lightWindow


function createWindow() {
  mainWindow = new BrowserWindow({ width: 1280, height: 720 })

  console.log(app.getPath('userData'))
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  // mainWindow.webContents.openDevTools()
  electron.globalShortcut.register("command+i", () => {
    lightWindow = new BrowserWindow({ width: 600, height: 800 })
    lightWindow.loadURL(`file://${__dirname}/light/huecontrol.html`)
    lightWindow.webContents.openDevTools()
    lightWindow.on('closed', function () {
      lightWindow = null
    })
  })
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
