const infoEl = document.getElementById('info');

// 以下调用的 versions 相关内容，都是在预加载 preload.js 中定义的
const nodeVersion   = versions.node();
const chromeVersion = versions.chrome();
const electronVersion = versions.electron();

infoEl.innerHTML = `本应用正在使用
                    <b>Node.js (v${nodeVersion})</b>, 
                    <b>Chrome (v${chromeVersion})</b>, 
                    <b>Electron (v${electronVersion})</b>`;