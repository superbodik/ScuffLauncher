const { contextBridge, ipcRenderer } = require('electron');
window.ipcRenderer = ipcRenderer;

contextBridge.exposeInMainWorld('api', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  receive: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
});
