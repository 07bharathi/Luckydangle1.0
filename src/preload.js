// preload.js - Secure Electron Context Bridge
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setIgnoreMouseEvents: (ignore, options) => {
    ipcRenderer.send('set-ignore-mouse-events', ignore, options);
  },
  openGallery: () => {
    ipcRenderer.send('open-gallery');
  },
  getSettings: () => {
    return ipcRenderer.invoke('get-settings');
  },
  saveSettings: (settings) => {
    return ipcRenderer.invoke('save-settings', settings);
  },
  selectCharm: (slug, emoji) => {
    ipcRenderer.send('select-charm', { slug, emoji });
  },
  triggerRitual: () => {
    ipcRenderer.send('trigger-ritual');
  },
  toggleDangle: () => {
    ipcRenderer.send('toggle-dangle');
  },
  onCharmChanged: (callback) => {
    ipcRenderer.on('charm-changed', (_event, data) => callback(data));
  },
  onToggleDangle: (callback) => {
    ipcRenderer.on('toggle-dangle-event', () => callback());
  },
  onPerformRitual: (callback) => {
    ipcRenderer.on('perform-ritual-event', () => callback());
  }
});
