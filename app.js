var electron = require('electron');
var fs = require('fs');
var ipc = electron.ipcMain;

let app = electron.app;

app.on('ready', () => {
  var buffer = '';
  process.stdin.on('data', function(data) {
    buffer += data.toString();
  });
  process.stdin.once('end', function() {
    var options = JSON.parse(buffer);
    capture(options);
  });
})

function capture(opts) {
  let win = new electron.BrowserWindow({
    width: 200,
    height: 200,
    show: true,
    enableLargerThanScreen: true,
    skipTaskbar: true,
    useContentSize: true,
    webPreferences: {
      overlayScrollbars: false,
      pageVisibility: true,
      preload: `${__dirname}/preload.js`
    }
  });

  console.log(' == Loading url ' + opts.url);
  win.loadURL(opts.url);

  setTimeout(() => {
    win.webContents.executeJavaScript(`
      var ipcRenderer = nodeRequire('electron').ipcRenderer;
      ipcRenderer.send('screenshotValues', document.body.offsetHeight);
    `);
  }, 2000);

  ipc.on('screenshotValues', (event, value) => {
    // Height is set to whatever is set in the options.
    // If height is not set, scale to the size of the body
    // If body smaller than 200, minimum of 768 is set
    var height = (opts.height ? opts.height : Math.max(768, Math.min(8000, parseInt(value))));
    win.setContentSize(opts.width, height);
    console.log(' == Website body height is ' + value + ', viewport set to ' + height);

    setTimeout(() => {
      win.capturePage((data) => {
        console.log(" == Screenshot taken.");
        console.log(" == Saving image...");
        fs.writeFile(opts.output, data.toJpeg(100), () => {
          console.log(" == Image saved.");
          app.quit();
        });
      })
    }, opts.delay)
  })
}
