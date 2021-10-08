const { contextBridge, ipcRenderer } = require('electron')
const { config } = require('./utils/config');

contextBridge.exposeInMainWorld('electronApi', {
  getConfig: () => {
    return ipcRenderer.invoke('getConfig');
  },
  setConfig: (config) => {
    ipcRenderer.send('writeConfig', config);
  },
  loadFile: (path, type) => {
    console.log('loadfile', path, type);
    ipcRenderer.invoke('loadFile', path, type);
  },
  downloadBase: () => {
    return ipcRenderer.invoke('downloadBase');
  },
  build: () => {
    return ipcRenderer.invoke('build');
  }
})
