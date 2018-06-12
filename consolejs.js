//
//  License information: MIT License
//  
//  Copyright (c) Chris Schalick 2016 All Rights Reserved.
//  
//  Permission is hereby granted, free of charge, to any person obtaining a copy	 
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is furnished
//  to do so, subject to the following conditions:
//  
//    The above copyright notice and this permission notice shall be included in all
//    copies or substantial portions of the Software.
//  
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
//  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//  PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
//  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
//  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
//  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var consolejs = function(parent, linewidth, lines, id, font, fgcol, bgcol, transparent)
{
  "use strict";
  this.instance         = consolejs.instance++;
  this.linewidth        = linewidth; 
  this.lines            = lines; 
  this.cur_x            = 0; 
  this.cur_y            = 0; 
  this.x                = 0; 
  this.y                = 0;
  this.canvas           = document.createElement("canvas");
  this.id               = id; 
  this.canvas.id        = id + "_canvas"; 
  this.canvas.tabIndex  = '1';                             // allow canvas to receive focus
  this.out              = this.canvas.getContext("2d");

  this.fgcol            = (typeof fgcol == "undefined") ? "#00ff00" : fgcol;
  this.bgcol            = (typeof bgcol == "undefined") ? "#000000" : bgcol;
  this.transparent      = (typeof transparent != 'undefined') ? transparent : 0;
  this.font             = (typeof font == "undefined") ? "16px monospace" : font;
  this.out.font         = this.font;
  this.out.textAlign    = "left";
  var t = "Hello";
  this.out.fillText(t, 0, 0);
  var m = this.out.measureText(t);
  this.inc_x = Math.round(m.width / 5);
  this.inc_y = Math.round(this.inc_x * 2.0);

  this.canvas.width     = Math.floor(this.inc_x * (linewidth + 3));
  this.canvas.height    = this.inc_y * (lines + 1);
  var p = document.getElementById(parent);
  if(p != null)
    p.appendChild(this.canvas);
  else
    document.body.appendChild(this.canvas);
  this.cls();
  this.canvas.onkeydown = this.kbhit;
  this.canvas.parent    = this;

  this.kbbfr            = [];
  this.edbfr            = [];
  this.last_edbfr       = [];
  this.chbfr            = [];
  for(t = 0; t <= this.lines; t++)
    this.chbfr[t] = [];
  this.edit_x           = 0;
  this.edit_y           = 0;
  this.edit_idx         = 0;
  this.edit_cb          = null;
  this.input_cb         = null;
  this.cursor_enable    = 0;

  this.now              = 0;
  var me                = this;
  var tf                = function(){me.timer();};
  this.timers           = setInterval(tf, 20);
  this.chcnt            = 0;
};

consolejs.instance = 0;

consolejs.prototype.timer = function()
{
  "use strict";
  this.now++;
  this.blink_cursor();
  if(this.now == 50)
    this.now = 0;
}

consolejs.prototype.gotoxy = function(x, y)
{
  "use strict";
  this.cur_x = (x % this.linewidth);
  this.cur_y = y + parseInt(x / this.linewidth);
  this.check_scroll();
}

consolejs.prototype.tab = function(n)
{
  "use strict";
  if(n > this.linewidth)
    return;

  var x, s = n - this.cur_x;
  if(this.cur_x > n)
    s += this.linewidth;

  for(x = 0; s < s; x++)
    this.putchar(' ');
}

consolejs.prototype.putchar = function(c)
{
  "use strict";
  var r;

  this.chcnt++;
  this.cursor(0);
  this.out.font      = this.font;
  this.out.fillStyle = this.fgcol;
  if((c == '\r') || (c == '\n'))
  {
    this.chbfr[this.cur_y][this.cur_x] = c;
    this.cur_x = 0;
    this.cur_y++;
    this.check_scroll();
  }
  else if(c == '\t')
  {
    this.tab(1);
  }
  else 
  {
    if(typeof c != "undefined")
    {
      this.chbfr[this.cur_y][this.cur_x] = c;
      this.out.fillText(c, (this.cur_x + 1) * this.inc_x, (this.cur_y + 1) * this.inc_y);
    }
    this.cur_x++;
  }
  if(this.cur_x > this.linewidth)
  {
    this.cur_x = 0;
    this.cur_y++;
    this.check_scroll();
  }
}

consolejs.prototype.check_scroll = function()
{
  "use strict";
  var pg, l, c, num_lines = this.lines;
  if(this.cur_y >= num_lines)
  {
    pg = [];    
    for(l = 0; l < (num_lines - 1); l++){
      this.chbfr[l] = [];
      pg[l] = this.chbfr[l + 1];
      for(c = 0; c < this.linewidth; c++){
        if((pg[l][c] == '\r') || (pg[l][c] == '\n')){
          pg[l] = pg[l].slice(0, c + 1);
          c = this.linewidth;
	}
      }
    }
    this.chbfr[num_lines - 1] = [];
    this.cls();
    for(l = 0; l < (num_lines - 1); l++)
      this.print(pg[l]);
  }
}

consolejs.prototype.print = function(str)
{
  "use strict";
  var x;
  if(typeof str != "undefined")
    for(x = 0; x < str.length; x++)
      this.putchar(str[x]);
}

consolejs.prototype.cls = function()
{
  "use strict";
  var s = this.out.fillStyle;
  this.out.fillStyle = this.bgcol;
  if(this.transparent)
    this.out.clearRect(0, 0, this.canvas.width, this.canvas.height);
  else
    this.out.fillRect(0, 0, this.canvas.width, this.canvas.height);
  this.out.fillStyle = s;
  this.cur_x = 0;
  this.cur_y = 0;
  this.edit_x = 0;
  this.edit_y = 0;
}

consolejs.prototype.kbhit = function(e)
{
  "use strict";
  e.preventDefault();
  this.parent.kbbfr.push(e);

  if(this.parent.edit_cb != null)
    this.parent.editor();
}

consolejs.prototype.editor = function()
{
  "use strict";
  var code, chr, hold, ans;
  this.cursor(0);
  this.last_edbfr = this.edbfr;
  this.show_edits(0);
  while (this.kbbfr.length > 0)
  {
    chr  = this.kbbfr[0].key;
    code = this.kbbfr[0].which;
    if(this.printable_key(code))
    {
      if(this.edit_idx == this.edbfr.length)
        this.edbfr.push(chr);
      else
      {
        hold = this.edbfr;
        this.edbfr = hold.slice(0, this.edit_idx);
        this.edbfr = this.edbfr.concat(chr);
        this.edbfr = this.edbfr.concat(hold.slice(this.edit_idx));
      }
      this.edit_idx++;
    }
    else
    {
      if(code == 8)       // backspace
      {
        if(this.edit_idx > 0)
        {
          hold = this.edbfr;
          this.edbfr = hold.slice(0, this.edit_idx - 1);
          this.edbfr = this.edbfr.concat(hold.slice(this.edit_idx));
          this.edit_idx--;
        }
      }
      else if(code == 9)  // tab
      {
      }
      else if(code == 13) // enter
      {
        this.edit_cb = null;
        this.cursor_enable = 0;
	this.show_edits(1);
	this.putchar('\n');
        ans = this.edbfr.join('');
        if(!isNaN(ans))
          this.input_cb(parseFloat(ans));
        else
          this.input_cb(ans);
        this.kbbfr.shift();
        return;
      }
      else if(code == 27) // escape
      {
        this.edbfr = [];
        this.edit_idx = 0;
      }
      else if(code == 35) // end
        this.edit_idx = this.edbfr.length;
      else if(code == 36) // home
        this.edit_idx = 0;
      else if(code == 37) // left arrow
        this.edit_idx = this.edit_idx > 0 ? this.edit_idx - 1 : 0;
      else if(code == 39) // right arrow
        this.edit_idx = this.edit_idx < this.edbfr.length ? this.edit_idx + 1 : this.edbfr.length;
      else if(code == 45) // insert
      {
      }
      else if(code == 46) // delete
      {
        if(this.edit_idx < this.edbfr.length)
        {
          hold = this.edbfr;
          this.edbfr = hold.slice(0, this.edit_idx);
          this.edbfr = this.edbfr.concat(hold.slice(this.edit_idx + 1));
        }
      }
    }
    this.kbbfr.shift();
  }

  this.show_edits(1);
}

consolejs.prototype.show_edits = function(on)
{
  "use strict";
  var x;
  if(!on)
  {
    for(x = 0; x < this.last_edbfr.length; x++)
    {
      this.gotoxy(this.edit_x + x, this.edit_y);
      this.cursor(0);
    }
    return;
  }
  this.gotoxy(this.edit_x, this.edit_y);
  this.print(this.edbfr);
  this.gotoxy(this.edit_x + this.edit_idx, this.edit_y);
}

consolejs.prototype.cursor = function(on)
{
  "use strict";
  var fs = this.out.fillStyle;
  var mg;
  if(on)
  {
    this.out.fillStyle = this.fgcol;
    mg = 1;
  }
  else 
  {
    this.out.fillStyle = this.bgcol;
    mg = 0;
  }

  var x = (this.cur_x + 1) * this.inc_x + mg;
  var y = this.cur_y * this.inc_y + this.inc_y / 4 + mg;
  this.out.fillRect(x, y, this.inc_x - 2 * mg, this.inc_y - 2 * mg);
  this.out.fillStyle = fs;
}

consolejs.prototype.blink_cursor = function()
{
  "use strict";
  if((this.now == 25) || !this.cursor_enable)
    this.cursor(0);
  if((this.now == 50) && this.cursor_enable)
    this.cursor(1);
}

consolejs.prototype.input = function(cb)
{
  "use strict";
  var c;
  this.edit_x        = this.cur_x;
  this.edit_y        = this.cur_y;
  this.edit_idx      = 0;
  this.edbfr         = [];
  this.last_edbfr    = [];
  this.edit_cb       = this.editor;
  this.input_cb      = cb;
  this.cursor_enable = 1;
  this.cursor(1);
}

consolejs.prototype.printable_key = function(code)
{
  "use strict";
  return (code != 8)  && (code != 13)  && (code != 16) && (code != 17) && (code != 18) && 
         (code != 20) && (code != 27)  && (code != 33) && (code != 34) && (code != 35) && 
         (code != 36) && (code != 37)  && (code != 38) && (code != 39) && (code != 40) && 
         (code != 46) && (code != 144) && 
         ((code < 112) || (code > 123));
}

consolejs.prototype.codes_to_char = function(ev)
{
  "use strict";
  var c, x;
  if(this.non_mod_key(ev.which))
  {
    c = String.fromCharCode(code);
    return c;
  }

  return code;
}

