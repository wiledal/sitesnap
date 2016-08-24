# Sitesnap [![npm version](https://badge.fury.io/js/sitesnap.svg)](https://badge.fury.io/js/sitesnap)
Screenshot sites from the terminal. Largely inspired by [Electroshot](https://github.com/mixu/electroshot).

## What?
Basic cli site screenshotting utility.  
Takes a screenshot of the desired site at the desired width, height and after a set delay.  
Outputs a high quality retina jpg.

## Installation
`npm install -g sitesnap`

## Usage
`sitesnap <url> <output.jpg> [--options]`

Run `sitesnap --help` for full list of options.

## Example usage
Using options: `sitesnap http://github.com github.jpg --height 320 --width 320 --delay 6000`  
Take a 320x320 screenshot of http://github.com after 6 seconds.

## Headless usage
To use `sitesnap` on a headless server you need some kind of display driver such as Xvfb.
```sh
# Install Xcfb and dependencies
apt-get update
apt-get install -y libgtk2.0-0 libgconf-2-4 libasound2 libxtst6 libxss1 libnss3 xvfb

# Start Xvfb
Xvfb -ac -screen scrn 1280x2000x24 :9.0
export DISPLAY=:9.0
```
