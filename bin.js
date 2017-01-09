#!/usr/bin/env node

const fs = require('fs');
const yargs = require('yargs');
const spawn = require('child_process').spawn;

var argv = yargs.argv;

var url = argv._[0];
var output = argv._[1];
var delay = argv.delay || 2000;
var width = argv.width || 1200;
var height = argv.height || false;
var quality = argv.quality || 100;
var scaleFactor = argv.scalefactor || 2;

if (argv.help) {
  console.log(
`USAGE
  sitesnap <url> <output.jpg> [--options]

OPTIONS
  --height <px>         Set the height of the output
                        Default is the site's body-height
                        If the body-height is < 768, default is 768

  --width <px>          Set the width of the output
                        Default is 1200

  --delay <ms>          Set the delay before snapshot should take place
                        Default is 2000

  --quality <0-100>     Set the quality of the output
                        Default is 100

  --scalefactor <num>   Set the scale of the image
                        Default is 2 (retina) for crisp typography etc
                        Warning: use a scalefactor > 2 with caution and with
                          set width and height to avoid rendering issues
`)
  process.exit()
}

if (!url || !output) {
  console.log('Not enough arguments supplied...')
  console.log(`Usage: sitesnap <url> <output.jpg> [--options]`)
  console.log(`Run 'sitesnap --help' for a list of options.`)
  process.exit();
}

var child = spawn(__dirname + '/node_modules/.bin/electron', [__dirname + '/app.js', '--force-device-scale-factor=' + scaleFactor], {
  stdio: ['pipe', process.stdout, process.stderr]
});

child.stdin.end(JSON.stringify({
  url,
  output,
  delay,
  width,
  height,
  quality
}));
