/**
 * ipc主线程 处理
 */

const { ipcMain, nativeTheme } = require('electron');
const path = require('path');

// dark-mode:toggle
const darkModeToggle = function () {
  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light';
    } else {
      nativeTheme.themeSource = 'dark';
    }
    return nativeTheme.shouldUseDarkColors;
  });
}

// dark-mode:system
const darkModeSystem = function () {
  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system';
  });
}

// ondragstart
const dragStartHandler = function () {
  ipcMain.on('ondragstart', (event, filePath) => {
    event.sender.startDrag({
      // file: path.join(__dirname, filePath),
      file: path.join(process.cwd(), filePath),
      icon: './assets/iconForDragAndDrop_100x100.png'
    })
  });
}

module.exports = {
  darkModeToggle,
  darkModeSystem,

  dragStartHandler,
}