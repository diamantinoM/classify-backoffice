const Store = require('electron-store');
const storage = new Store();

function getWindowSettings() {
    const defaultBounds = [1280, 850];
    const size = storage.get('win-size');

    if(size) return  size;
    else {
        storage.set('win-size', defaultBounds);
        return defaultBounds;
    };
}

function getWindowPosition() {
    const defaultPosition = [640, 270];
    const position = storage.get('win-position');

    if(position) return position;
    else {
        storage.set('win-position', defaultPosition);
        return defaultPosition;
    }
}

function saveBounds(bounds) {
    storage.set('win-size', bounds);
}

function savePosition(position) {
    storage.set('win-position', position);
}

module.exports = {
    getWindowSettings: getWindowSettings,
    saveBounds: saveBounds,
    savePosition: savePosition,
    getWindowPosition: getWindowPosition
}