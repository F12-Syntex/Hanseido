// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import Store from 'electron-store';
import { getAssetsPath, getHtmlPath, getPreloadPath } from './utils';
import './updater';

function createWindow() {
  const mainWindow = new BrowserWindow({
    icon: getAssetsPath('icon.ico'),
    width: 1200,
    height: 800,
    webPreferences: {
      devTools: false,
      preload: getPreloadPath('preload.js'), // 👈 Don't USE PRELOAD.JS IF YOUR USING NODE IN RENDERER PROCESS
      // nodeIntegration: true, // 👈 NODE.JS WILL AVAILABLE IN RENDERER
      // contextIsolation: false, // 👈 ENABLE THIS FOR NODE INTEGRATION IN RENDERER
    },
  });

  mainWindow.loadURL(getHtmlPath('index.html'));
  mainWindow.setMenu(null);

  /* AUTO UPDATER INVOKE */
  autoUpdater.checkForUpdatesAndNotify();

  /* DEBUG DEVTOOLS */
  // if (isDebug) {
  //   mainWindow.webContents.openDevTools(); // ELECTRON DEVTOOLS
  //   installExtensions(); // REACT DEVTOOLS INSTALLER
  // }

  /* URLs OPEN IN DEFAULT BROWSER */
  mainWindow.webContents.setWindowOpenHandler((data) => {
    shell.openExternal(data.url);
    return { action: 'deny' };
  });
}

/* IPC EVENTS EXAMPLE */
ipcMain.on('message', (event, arg) => {
  // eslint-disable-next-line no-console
  console.log(`IPC Example: ${arg}`);
  event.reply('reply', 'Ipc Example:  pong 🏓');
});

/** ELECTRON STORE EXAMPLE
 *  NOTE: LOCAL STORAGE FOR YOUR APPLICATION
 */
const store = new Store();
ipcMain.on('set', (_event, key, val) => {
  // eslint-disable-next-line no-console
  console.log(`Electron Store Example: key: ${key}, value: ${val}`);
  store.set(key, val);
});
ipcMain.on('get', (event, val) => {
  // eslint-disable-next-line no-param-reassign
  event.returnValue = store.get(val);
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
