/**
 * 预加载
 * - 此文件是预加载脚本用，在renderer.js渲染前加载
 * - 有权限访问 window、document、Node.js环境
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