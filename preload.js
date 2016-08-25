window.nodeRequire = require;
delete window.require;
delete window.exports; delete window.module;

var ipc = nodeRequire('electron').ipcRenderer;

ipc.on('injectBaseStyles', () => {
  try {
    var style = document.createElement('style');
    style.innerHTML = 'body { background: #fff; } ::-webkit-scrollbar { display: none; }';
    document.head.insertBefore(style, document.head.firstChild);
  }catch(e) {}
});

ipc.on('getContentHeight', () => {
  var height = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  );
  ipc.send('getContentHeightReturn', height);
});

ipc.on('waitOneFrame', () => {
  requestAnimationFrame(() => {
    ipc.send('waitOneFrameReturn');
  })
})
