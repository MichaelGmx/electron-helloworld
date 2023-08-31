const { app, Tray, Menu } = require('electron')
// const path = require('path');

/**
 * 通知栏 图标
 */
const trayHander = function (win) {
  // const iconPath = path.join(__dirname, 'assets/electron_icon.png')
  const iconPath = './assets/electron_icon.png';
  let tray = new Tray(iconPath)
  tray.setToolTip('Hello Electron')

  // 点击
  tray.on('click', () => {
    win.isVisible() ? win.hide() : win.show()
  })

  // 右键
  tray.on('right-click', () => {
    const menuConfig = Menu.buildFromTemplate([
      {
        label: 'Quit',
        click: () => app.quit()
      }
    ])
    tray.popUpContextMenu(menuConfig)
  })
}


module.exports = {
  trayHander,
}