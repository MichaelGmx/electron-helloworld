const { app, BrowserWindow } = require('electron');
const path = require('path');

let win;

// 创建窗口
function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,

    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
}


// 一切开始 app模块 ready后，才能做 创建窗口等事件
app.whenReady().then(() => {
  createWindow();

  // 监听app模块 activate 事件
  app.on('activate', () => {
    // 如果没有窗口打开则打开一个窗口 (MacOS)
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

// 监听app模块 window-all-closed 事件
app.on('window-all-closed', () => {
  // darwin 表示MacOS，这里是MacOS特有处理
  if (process.platform !== 'darwin') {
    // 非MacOS系统(windows、Linux)，关闭窗口，退出程序
    app.quit();
  }
});