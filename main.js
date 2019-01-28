const electron = require('electron')
const {ipcMain} = require('electron')
const app = electron.app
require('electron-reload')(__dirname)

const BrowserWindow = electron.BrowserWindow

let mainWindow, lightWindow, winnerWindow


function createWindow() {
  mainWindow = new BrowserWindow({ width: 1280, height: 720, autoHideMenuBar: true, titleBarStyle: "hidden", fullscreen: true, frame: false })
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  electron.globalShortcut.register('F1', () => {
    mainWindow.close()
  })
  electron.globalShortcut.register('F5', () => {
    mainWindow.webContents.session.clearStorageData()
    mainWindow.reload()
  })
  electron.globalShortcut.register('F2', () => {
    if (winnerWindow) {
      winnerWindow.close()
    }
    if (lightWindow) {
      lightWindow.close()
    }
  })

  electron.globalShortcut.register('F3', () => {
    if (winnerWindow) {
      winnerWindow.webContents.openDevTools()
    }
    if (lightWindow) {
      lightWindow.webContents.openDevTools()
    }
    if (mainWindow) {
      mainWindow.webContents.openDevTools()
    }
  })
  electron.globalShortcut.register("CommandOrControl+i", () => {
    if (lightWindow) {
      return
    }
    lightWindow = new BrowserWindow({ width: 600, height: 800, parent: mainWindow, modal: true, autoHideMenuBar: true})
    lightWindow.loadURL(`file://${__dirname}/light/huecontrol.html`)
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


ipcMain.on('create-window', (event, arg) => {
  if (arg === "winner") {
    winnerWindow = new BrowserWindow({width: 1280, height: 720, parent: mainWindow, modal: true, show: false})
    winnerWindow.webContents.on('did-finish-load', ()=>{
      winnerWindow.show();
      winnerWindow.focus();
    });
    winnerWindow.loadURL(`file://${__dirname}/main/pages/win.html`)
    winnerWindow.on('closed', function () {
      winnerWindow = null
    })
  }
})