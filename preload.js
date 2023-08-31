/**
 * 预加载
 * - 此文件是预加载脚本用，在renderer.js渲染前加载
 * - 有权限访问 window、document、Node.js环境
 * 
 * 目前的版本（Electron 12+），默认情况下，启用了 上下文隔离
 * 给渲染进程(renderer.js) 暴露一个方法就必须使用 contextBridge.exposeInMainWorld
 * 并且考虑到安全性，还需配合ipcRenderer.invoke()方法，而不是直接返回特权API本身
 * 参考：https://www.electronjs.org/zh/docs/latest/tutorial/context-isolation
 */

const { contextBridge, ipcRenderer } = require('electron');
// const path = require('path');

// version info
contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

// Dark mode
contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
});

// native file  drag event
contextBridge.exposeInMainWorld('uxNativeDrag', {
  startDrag: (fileName) => {
    ipcRenderer.send('ondragstart', fileName)
  }
});

// Electron API - Bluetooth
contextBridge.exposeInMainWorld('electronAPI', {
  cancelBluetoothRequest: (callback) => ipcRenderer.send('cancel-bluetooth-request', callback),
  bluetoothPairingRequest: (callback) => ipcRenderer.on('bluetooth-pairing-request', callback),
  bluetoothPairingResponse: (response) => ipcRenderer.send('bluetooth-pairing-response', response)
})

// web DOMContentLoaded event listener
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
});