const { app, BrowserWindow } = require('electron');
const url = require("url");
const path = require("path");
const { listenToIpc } = require('./utils/ipc');
const { loadConfig } = require('./utils/file/load-config');

let mainWindow

function createWindow() {
  loadConfig();
  listenToIpc();

  mainWindow = new BrowserWindow({
    width         : 800,
    height        : 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `../dist/wiiu-vc-inject/index.html`),
      protocol: "file:",
      slashes : true
    })
  );

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}



app.on('ready', createWindow)


app.on('window-all-closed', function () {
  //if ( process.platform !== 'darwin' )
  app.quit()
})

app.on('activate', function () {
  if ( mainWindow === null ) createWindow()
})
