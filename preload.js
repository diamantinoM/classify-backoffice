const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {
    dialog: (title, content) => ipcRenderer.invoke('dialog', title, content),
    
    // we can also expose variables, not just functions
});