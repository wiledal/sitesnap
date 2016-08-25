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
    width: opts.width,
    height: opts.height,
    x: 99999,
    y: 99999,
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
  var loadFailed = false;

  var outputPath = opts.output;

  // Add .jpg to output path if not exists
  if (outputPath.indexOf('.jpg') === -1) outputPath += '.jpg';

  // Check if url is using http-protocol
  if (!opts.url.match(/(http|https)\:\/\//gi)) {
    process.stderr.end('Not a valid url');
    app.quit();
    return;
  }

  console.log(' == Loading url ' + opts.url);
  win.loadURL(opts.url);
  win.webContents.on('did-fail-load', (event, code, desc) => {
    if (desc === 'OK') return;
    console.log(' == Load error: ' + desc);
    process.stderr.end('Could not load url');
    loadFailed = true;

    setTimeout(() => {
      app.quit();
    }, 100)
  })

  win.webContents.on('dom-ready', () => {
    if (loadFailed) return;

    // Get the height and apply white background as default
    win.webContents.executeJavaScript(`
      try {
        var style = document.createElement('style');
        style.innerHTML = 'body { background: #fff; } ::-webkit-scrollbar { display: none; }';
        document.head.insertBefore(style, document.head.firstChild);
      }catch(e) {}

      var height = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      var ipcRenderer = nodeRequire('electron').ipcRenderer;
      ipcRenderer.send('screenshotValues', height);
    `);
  })

  ipc.on('screenshotValues', (event, value) => {
    // Height is set to whatever is set in the options.
    // If height is not set, scale to the size of the body
    // If body smaller than 200, minimum of 768 is set
    var height = (opts.height ? opts.height : Math.max(768, Math.min(8000, parseInt(value))));
    win.setContentSize(opts.width, height);
    console.log(' == Website body height is ' + value + ', viewport height set to ' + height);

    // Some sites rely on scroll events to load properly, so we trigger one after resize.
    console.log(' == Triggering scroll event');
    win.webContents.executeJavaScript(`
      document.body.dispatchEvent(new CustomEvent('scroll'));
      window.dispatchEvent(new CustomEvent('scroll'));
    `);

    console.log(` == Delaying capture by ${opts.delay}ms`)
    setTimeout(() => {
      win.capturePage((data) => {
        console.log(" == Screenshot taken.");
        console.log(" == Saving image: " + outputPath);
        fs.writeFile(outputPath, data.toJpeg(opts.quality), () => {
          console.log(" == Image saved.");
          app.quit();
        });
      })
    }, opts.delay)
  })
}
