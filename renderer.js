/********
 * renderer渲染器 无权直接访问 node.js相关API（包括 require）
 * 所以 使用的参数 或 调用的方法 都是preload.js或其它地方输出出来的
 * 如下：window.xxx
 */

const infoEl = document.getElementById('info');

// 以下调用的 versions 相关内容，都是在预加载 preload.js 中定义的
const nodeVersion     = window.versions.node();
const chromeVersion   = window.versions.chrome();
const electronVersion = window.versions.electron();

infoEl.innerHTML = `本应用正在使用
                    <b>Node.js (v${nodeVersion})</b>, 
                    <b>Chrome (v${chromeVersion})</b>, 
                    <b>Electron (v${electronVersion})</b>`;


/**
 * Dark/Light Mode toggle
 */
document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
  const isDarkMode = await window.darkMode.toggle()
  document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
});

document.getElementById('reset-to-system').addEventListener('click', async () => {
  await window.darkMode.system()
  document.getElementById('theme-source').innerHTML = 'System'
});


/**
 * Drag Event
 * - 将文件(此处是markdown文件) 使用拖拽 "复制"到 指定文件目录系统
 */
document.getElementById('dragEl').ondragstart = (event) => {
  event.preventDefault()
  window.uxNativeDrag.startDrag('drag-and-drop.md')
}


/**
 * Notification 通知
 * - Notification是electron中自带的，无需preload or ipc
 */
document.getElementById('btn-show-notify').addEventListener('click', () => {
  new Notification('Title test', {
    body: 'Notification from the Renderer process. Click to log to console.'
  }).onclick = () => {
    document.getElementById('output').innerText = 'Notification clicked!';
  }
});


/**
 * Bluetooth
 */
document.getElementById('btn-bluetooth-available').addEventListener('click', async () => {
  const isAvailable = await navigator.bluetooth.getAvailability()

  document.getElementById('bluetooth-available-result').innerHTML = isAvailable ? 
    '<span class="text-success">Available</span>' : '<span class="text-error">Not Available</span>';
})

// 点击 测试 蓝牙
document.getElementById('btn-bluetooth-test').addEventListener('click', async () => {
  // web Bluetooth
  // 参考：https://developer.mozilla.org/zh-CN/docs/Web/API/Bluetooth/requestDevice
  const device = await navigator.bluetooth.requestDevice({
    acceptAllDevices: true
  })

  if (device) {
    document.getElementById('bluetooth-device-name').innerHTML = device.name || `ID: ${device.id}`  
  } else {
    document.getElementById('bluetooth-test-info').innerText = '未检测到任何 蓝牙适配器'
  }
})

// 点击 取消 蓝牙请求
document.getElementById('btn-bluetooth-cancel-request').addEventListener('click', () => {
  window.electronAPI.cancelBluetoothRequest()
})

// 监听 蓝牙 匹配请求
window.electronAPI.bluetoothPairingRequest((event, details) => {
  const response = {}

  switch (details.pairingKind) {
    case 'confirm': {
      response.confirmed = window.confirm(`Do you want to connect to device ${details.deviceId}?`)
      break
    }
    case 'confirmPin': {
      response.confirmed = window.confirm(`Does the pin ${details.pin} match the pin displayed on device ${details.deviceId}?`)
      break
    }
    case 'providePin': {
      const pin = window.prompt(`Please provide a pin for ${details.deviceId}.`)
      if (pin) {
        response.pin = pin
        response.confirmed = true
      } else {
        response.confirmed = false
      }
    }
  }

  // 蓝牙 匹配 响应
  window.electronAPI.bluetoothPairingResponse(response)
})