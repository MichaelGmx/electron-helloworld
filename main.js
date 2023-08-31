const { app, BrowserWindow, BrowserView } = require('electron');
const path = require('path');

const { gbShortcut } = require('./common/globalFn');
const { darkModeToggle, darkModeSystem, dragStartHandler } = require('./common/ipc_handle');
const { trayHander } = require('./layout/tray');
// const { initApplicationMenu } = require('./layout/menu');

let mainWin;
let progressInterval;

// 创建窗口
const createWindow = function () {
  mainWin = new BrowserWindow({
    width: 800,
    height: 600,

    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    
    // frame: false,   // 无边框窗口，菜单栏也会一并被隐藏

    // titleBarStyle: 'hidden',
    // titleBarOverlay: true,
    // titleBarOverlay: {
    //   color: '#2f3241',
    //   symbolColor: '#74b1be',
    //   height: 60
    // },
    // transparent: true,
  });

  mainWin.loadFile('index.html');

  // 进度条Progress
  /*
  const INCREMENT = 0.03
  const INTERVAL_DELAY = 100 // ms
  let c = 0
  progressInterval = setInterval(() => {
    // update progress bar to next value
    // values between 0 and 1 will show progress, >1 will show indeterminate or stick at 100%
    mainWin.setProgressBar(c)
    // increment or reset progress bar
    if (c < 2) {
      c += INCREMENT
    } else {
      c = (-INCREMENT * 5) // reset to a bit less than 0 to show reset state
    }
  }, INTERVAL_DELAY)
  */



  // 使用 web APIs 按钮监听，实现 快捷键的方式
  // - 注：会与原生冲突
  /*
  mainWin.webContents.on('before-input-event', (event, input) => {
    // 组合键被成功拦截
    if (input.control && input.key.toLowerCase() === 'i') {
      console.log('Pressed Control+I')
      event.preventDefault()
    }
  });
  */
}


// 初始化 菜单栏
// initApplicationMenu();

// dark-mode:toggle
darkModeToggle();
// dark-mode:system
darkModeSystem();

// ondragstart event handler
dragStartHandler();


// 一切开始 app模块 ready后，才能做 创建窗口等事件
app.whenReady()
  .then(() => {
    /**
     * 全局快捷键
     * - *需要在 app.whenReady里，且createWindow前 加载
     */
    gbShortcut('Alt+CommandOrControl+I', () => {
      console.log('GlobalSshortcuts: Alt+CommandOrControl+I');
    });
  })
  .then(() => {
    // 创建窗口
    createWindow();

    // 通知栏 图标
    trayHander(mainWin);
  })
  .catch(err => {
    console.log('app.whenReady catch err: ', err);
  });



// before the app is terminated
app.on('before-quit', () => {
  // clear timers
  clearInterval(progressInterval);
});

// 监听app模块 window-all-closed 事件
app.on('window-all-closed', () => {
  // darwin 表示MacOS，这里是MacOS特有处理
  if (process.platform !== 'darwin') {
    // 非MacOS系统(windows、Linux)，关闭窗口，退出程序
    app.quit();
  }
});

// 监听app模块 activate 事件
app.on('activate', () => {
  // 如果没有窗口打开则打开一个窗口 (MacOS)
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});