# consolejs
Zero dependency web widget to implement a console command processor like what you'd see on a CP/M machine or retro computer console (input-process-print interface). This is a client side only, browser console in pure javascript. It uses an HTML5 canvas and keystroke processing to implement a line editor text IO space (like a VT100 terminal). 

It's pretty small (1625 bytes minified, gzipped).

# why?
I did it because it was fun, it works for me, your mileage may vary. It supports gotoxy(), cls() and kbhit() because...retro computer, but really print() and input() get the most use. I use it mostly for web app user log messaging and user selections / keyboard control.

# usage
Speaking of use, usage is pretty simple:

  1) Create a new consolejs object in a parent DOM element with desired dimensions, font and colors.
     The default colors are "scary green 16px monospace on black background".
  2) Call print or input (advanced users may want gotoxy, cls, kbhit)
  3) rinse and repeat, that's it
  
It does not scroll right now though that doesn't seem complicated. FWIW my retro computer consoles don't scroll either, so it seems true to concept.

Github searches for console, jsconsole or consolejs show a million hits, probably some with prettier and fancier coding style than this, so use it if you like...

There is a live demo of the example in HTML here:

https://rawgit.com/northeastnerd/consolejs/master/console_example.html

And a more elaborate use here showing a browser based retro computer basic IDE here:

https://www.webthinglabs.com/basic_console.html

# Testing
Verified on:
* Edge 41.16299.248.0
* Chrome 64.0.3282.186
* Firefox 58.0.2

# Quirks + Issues
One thing I notice with this is if you print a ton of text expecting it to fly by on the console it bogs down the browser rendering engine re-painting the canvas and appears to be doing nothing. When it catches up you see what you expect (the end of the prints) but it can take a really long time if you print a lot. It's definitely better used in interactive applications.
