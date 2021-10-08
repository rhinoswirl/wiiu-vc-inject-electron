const { app, BrowserWindow, ipcMain } = require('electron');
const { loadFile } = require('./file/load-file');
const { writeConfig } = require('./file/load-config');
const { prepare } = require('./prepare/prepare');
const { config } = require('./config');
const { build } = require('./build/build');

module.exports.listenToIpc = () => {
  ipcMain.handle('loadFile', (event, file, system) => {
    return loadFile(file, system);
  });

  ipcMain.on('writeConfig', (event, arg) => {
    writeConfig(arg);
  });

  ipcMain.handle('getConfig', (event, arg) => {
    return config.get();
  });

  ipcMain.handle('downloadBase', (event, arg) => {
    return prepare();
  });

  ipcMain.handle('build', (event, arg) => {
    return build();
  });
}

