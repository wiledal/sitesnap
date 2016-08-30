# Sitesnap
[![npm version](https://badge.fury.io/js/sitesnap.svg)](https://badge.fury.io/js/sitesnap)  

Screenshot sites from the terminal.
Uses Electron (Chromium) for rendering and capture.  
Largely inspired by [Electroshot](https://github.com/mixu/electroshot).

## What?
Basic cli site screenshotting utility.  
Takes a screenshot of the desired site at the desired width, height and after a set delay.  
Outputs a high quality retina jpg.

## Installation
`npm install -g sitesnap`

## Usage
`sitesnap <url> <output.jpg> [--options]`

If no `--height` is supplied, `sitesnap` will try to snap the full length of the page.  

**Run `sitesnap --help` for full list of options.**

## Example usage
Take a 500px wide retina screenshot of github.com, and save as `githubscreenshot.jpg`:  
`sitesnap http://github.com githubscreenshot --width 500`

Take a 1200x1200 screenshot of newgrounds.com at 1x scale (non-retina) and 50% quality:  
`sitesnap http://github.com githubscreenshot --height 500 --quality 50 --scalefactor 1`

## Headless usage
To use `sitesnap` on a headless server you need some kind of display driver such as Xvfb.
```sh
# Install Xvfb and dependencies
apt-get update
apt-get install -y libgtk2.0-0 libgconf-2-4 libasound2 libxtst6 libxss1 libnss3 xvfb

# Start Xvfb and expose DISPLAY
Xvfb -ac -screen scrn 1280x2000x24 :9.0 & export DISPLAY=:9.0
```

## License
ISC License

Copyright (c) 2016, Hugo Wiledal

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
