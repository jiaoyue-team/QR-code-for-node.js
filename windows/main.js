const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const QRCode = require('qrcode');
const fs = require('fs');
const { Jimp } = require('jimp');

let mainWindow;

// 停用 GPU 與 HTTP 快取，避免在 Windows 開發時狂噴 cache_util_win.cc 的錯誤
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
app.commandLine.appendSwitch('disable-http-cache');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 850,
    height: 800,
    resizable: false,
    frame: true,
    icon: path.join(__dirname, 'icons', 'icon-256x256.png'),
    backgroundColor: '#0f0f1a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Get QR Matrix for frontend Canvas rendering
ipcMain.handle('get-qr-matrix', async (event, { text, errorCorrectionLevel }) => {
  try {
    const qr = QRCode.create(text, { errorCorrectionLevel: errorCorrectionLevel || 'M' });
    // qr.modules.data is a Uint8Array, convert to standard array to pass via IPC
    return { success: true, size: qr.modules.size, data: Array.from(qr.modules.data) };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Save QR Code to file from frontend data URL
ipcMain.handle('save-qr', async (event, { dataUrl, format }) => {
  try {
    const ext = format === 'jpg' ? 'jpeg' : format;
    
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: '儲存 QR Code',
      defaultPath: `qrcode.${format}`,
      filters: [
        { name: `${ext.toUpperCase()} 圖片`, extensions: [ext] }
      ]
    });

    if (canceled || !filePath) {
      return { success: false, error: 'cancelled' };
    }

    // Decode base64 and write to file
    const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);

    return { success: true, filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});
