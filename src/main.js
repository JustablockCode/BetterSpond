const { app, BrowserWindow, BrowserView, ipcMain, globalShortcut, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  console.log('Creating window...');
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
      sandbox: false,
      devTools: true,
      enableRemoteModule: true
    }
  });

  console.log('Creating BrowserView...');
  const view = new BrowserView({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
      sandbox: false,
      devTools: true,
      enableRemoteModule: true
    }
  });

  console.log('Setting BrowserView...');
  mainWindow.setBrowserView(view);

  function updateBounds() {
    const bounds = mainWindow.getContentBounds();
    view.setBounds({ x: 0, y: 0, width: bounds.width, height: bounds.height });
  }


  updateBounds();

  mainWindow.on('resize', updateBounds);
  mainWindow.on('maximize', updateBounds);
  mainWindow.on('unmaximize', updateBounds);
  mainWindow.on('enter-full-screen', updateBounds);
  mainWindow.on('leave-full-screen', updateBounds);

  console.log('Loading URL...');
  view.webContents.loadURL('https://spond.com/client');

  view.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  view.webContents.on('did-finish-load', () => {
    console.log('Page loaded successfully');
    view.webContents.executeJavaScript('console.log("Injected log from main process")');
  });



  setInterval(updateBounds, 1000);

  // mainWindow.webContents.openDevTools();
  // view.webContents.openDevTools();

  globalShortcut.register('CommandOrControl+Shift+I', () => {
    view.webContents.toggleDevTools();
  });
}


app.whenReady().then(() => {
  console.log('App is ready, creating window...');
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('render-process-gone', (event, webContents, details) => {
  console.error('Render process gone:', details);
});

app.on('child-process-gone', (event, details) => {
  console.error('Child process gone:', details);
});

ipcMain.on('restart-app', () => {
  app.relaunch();
  app.exit();
});

