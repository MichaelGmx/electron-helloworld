/**
 * 全局通用 Function
 */

const { globalShortcut } = require('electron')

/**
 * 定制 electron 全局快捷键
 * @param {string} accelerator 快捷键组合
 */
const gbShortcut = function(accelerator, callbackFn) {
  globalShortcut.register(accelerator, callbackFn);
}


module.exports = {
  gbShortcut,
}