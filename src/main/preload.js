// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  fetchMessages: () => ipcRenderer.invoke('fetch-messages'),
  fetchCalls: () => ipcRenderer.invoke('fetch-calls'),
});
