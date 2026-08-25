const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('qrAPI', {
  getQRMatrix: (options) => ipcRenderer.invoke('get-qr-matrix', options),
  generateQR: (options) => ipcRenderer.invoke('generate-qr', options),
  saveQR: (options) => ipcRenderer.invoke('save-qr', options)
});
