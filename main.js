const electron = require('electron')
const {ipcMain} = require('electron')
const app = electron.app
require('electron-reload')(__dirname)

const BrowserWindow = electron.BrowserWindow

let mainWindow, lightWindow, winnerWindow


function createWindow() {
  mainWindow = new BrowserWindow({ width: 1280, height: 720 })

  mainWindow.loadURL(`file://${__dirname}/index.html`)
  mainWindow.webContents.openDevTools()
  electron.globalShortcut.register('F5', () => {
    mainWindow.reload()
  })
  electron.globalShortcut.register("CommandOrControl+i", () => {
    lightWindow = new BrowserWindow({ width: 600, height: 800, parent: mainWindow })
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


ipcMain.on('create-window', (event, arg) => {
  if (arg === "winner") {
    console.log("here")
    winnerWindow = new BrowserWindow({width: 1280, height: 720, parent: mainWindow})
    winnerWindow.webContents.on('did-finish-load', ()=>{
      winnerWindow.show();
      winnerWindow.focus();
    });
    winnerWindow.loadURL(`file://${__dirname}/main/pages/win.html`)
    winnerWindow.hide();
    winnerWindow.webContents.openDevTools()
    winnerWindow.on('closed', function () {
      winnerWindow = null
    })
  }
})