const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { dialog } = require('electron');
const { getWindowSettings, saveBounds } = require('./settings')

const isMac = process.platform === 'darwin';

function createMainWindow () {
    const bounds = getWindowSettings();
    
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        title: 'Classify App',
        width:  bounds[0],
        height: bounds[1],
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        icon: './renderer/images/classify-logo.png'
    });
    ipcMain.handle('dialog', (_, options) => dialog.showMessageBox(options));
    ipcMain.handle('setToken', (_, token) => Store.setItem('token', token));
    
    mainWindow.on('resized', () => saveBounds(mainWindow.getSize()));
    
    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, './renderer/sign-in.html'));
}   

app.whenReady().then(() => {
    createMainWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0){
            createMainWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});