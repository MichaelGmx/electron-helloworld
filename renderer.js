const infoEl = document.getElementById('info');

// 以下调用的 versions 相关内容，都是在预加载 preload.js 中定义的
const nodeVersion     = versions.node();
const chromeVersion   = versions.chrome();
const electronVersion = versions.electron();

infoEl.innerHTML = `本应用正在使用
                    <b>Node.js (v${nodeVersion})</b>, 
                    <b>Chrome (v${chromeVersion})</b>, 
                    <b>Electron (v${electronVersion})</b>`;


/**
 * Dark/Light Mode toggle
 */
document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
  const isDarkMode = await darkMode.toggle()
  document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
});

document.getElementById('reset-to-system').addEventListener('click', async () => {
  await darkMode.system()
  document.getElementById('theme-source').innerHTML = 'System'
});


/**
 * Drag Event
 * - 将文件(此处是markdown文件) 使用拖拽 "复制"到 指定文件目录系统
 */
document.getElementById('dragEl').ondragstart = (event) => {
  event.preventDefault()
  uxNativeDrag.startDrag('drag-and-drop.md')
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