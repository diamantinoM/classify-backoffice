const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {
    dialog: (options) => ipcRenderer.invoke(
        'dialog', {...options}
    ),
    // we can also expose variables, not just functions
});