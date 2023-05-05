const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { dialog } = require('electron');

const isMac = process.platform === 'darwin';

function createMainWindow () {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        title: 'Classify App',
        width:  1280,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        icon: './renderer/images/classify-logo.png'
    })
    ipcMain.handle('dialog', (_, options) => dialog.showMessageBox(options));
    ipcMain.handle('setToken', (_, token) => Store.setItem('token', token));
    
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