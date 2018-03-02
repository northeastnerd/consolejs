# consolejs
Web widget to model retro computer console (print and input interface). This is a zero dependency, client side only browser console in pure javascript. It uses an HTML5 canvas and keystroke processing to implement an editable text space. 

# why?
I did it because it was fun, it works for me, your mileage may vary. It supports gotoxy(), cls() and kbhit() because...retro computer, but really print() and input() get the most use. I use it mostly for web app user log messaging and user selections / keyboard control.

# usage
Speaking of use, usage is pretty simple:

  1) Create a new consolejs object in a parent DOM element with desired dimensions, font and colors.
     The defaults are "scary green 16px monospace on black background"
  2) Call print or input (advanced users may want gotoxy, cls, kbhit)
  3) rinse and repeat, that's it
  
It does not scroll right now though that doesn't seem complicated. FWIW my retro computer consoles don't scroll either, so it seems true to concept.

Github searches for console, jsconsole or consolejs show a million hits, probably some with prettier and fancier coding style than this, so use it if you like...

There is a live demo of the example in HTML here:

https://rawgit.com/northeastnerd/consolejs/master/console_example.html

# Testing
Verified on:
* Edge 41.16299.248.0
* Chrome 64.0.3282.186
* Firefox 58.0.2
