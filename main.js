const path = require('path');
const { app, BrowserWindow } = require('electron');

const isDev = process.env.NODE_ENV === 'production';
const isMac = process.platform === 'darwin';

function createMainWindow () {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        title: 'Classify App',
        width: isDev ? 1280 : 1980,
        height: isDev ? 800 : 1080,
        webPreferences: {
            nodeIntegration: true
        },
        icon: './renderer/images/classify-logo.png'
    })

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, './renderer/sign-in.html'))

    // Open the DevTools.
    if(isDev) {
      mainWindow.webContents.openDevTools();
    }
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