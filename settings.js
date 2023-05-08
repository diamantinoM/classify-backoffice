const Store = require('electron-store');
const storage = new Store();

function getWindowSettings() {
    const defaultBounds = [1280, 850];

    const size = storage.get('win-size');

    if(size) return size;
    else {
        storage.set('win-size', defaultBounds);
        return defaultBounds;
    };
}

function saveBounds(bounds) {
    storage.set('win-size', bounds);
}

module.exports = {
    getWindowSettings: getWindowSettings,
    saveBounds: saveBounds
}