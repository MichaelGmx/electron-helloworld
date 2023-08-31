const { app, Menu, MenuItem } = require('electron');

/**
 * 初始化 自定义 Application 菜单栏
 * - 将完全替换 默认菜单栏
 */
const initApplicationMenu = function() {
  const menu = new Menu();
  menu.append(new MenuItem({
    label: 'Electron',
    submenu: [{
      role: 'help',
      accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',   // 快捷键
      click: () => {
        // 触发后，处理事件
        console.log('Electron rocks!')
      }
    }]
  }));

  Menu.setApplicationMenu(menu);    // 设置为应用菜单
}

/**
 * 初始化 MacOS专用 Dock菜单
 */
const initDockMenu = function() {
  const dockMenu = Menu.buildFromTemplate([
    {
      label: 'New Window',
      click: () => {
        console.log('New Window');
      }
    },
    {
      label: 'New Window with Settings',
      submenu: [
        { label: 'Basic' },
        { label: 'Pro' },
        { label: 'etc.' },
      ]
    },
    {
      label: 'New Command...'
    }
  ]);
  if (process.platform === 'darwin') {
    app.dock.setMenu(dockMenu);
  }
}


module.exports = {
  initApplicationMenu,
  initDockMenu,
}