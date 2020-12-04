import electron from 'electron';
import path from 'path';
import url from 'url';
import 'babel-polyfill';

const log = require('electron-log');
log.transports.file.file = path.join(__dirname, './.electron-log.txt');
log.transports.file.getFile().clear();

import MainWindow from './main_window';
import TrayIcon from './tray_icon';

const { app, ipcMain } = electron;

let mainWindow;
let tray;

const createWindow = () => {
  if(process.platform === 'darwin'){
    app.dock.hide();
  }

  mainWindow = new MainWindow(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
  const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
  const iconPath = path.join(__dirname, './assets', iconName);                                // ./assets with respect to the app folder
  tray = new TrayIcon(iconPath, mainWindow);

  // log.info(tray);
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
