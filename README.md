
# quaderno

A mini form templating system in javascript.

The rendering all happens in the browser.

    <div id="quad" class="quad_root"></div>

    <script>
      var template = '\n\
        tabs \n\
          tab "general" \n\
            text_input name \n\
            text_input age \n\
          tab "extra info" \n\
            text_input driving_license \n\
        '
      var data = { name: "Jo Average", age: 35 };

      Quaderno.render('#quad', template, data);
    </script>

will result in

<img src="http://github.com/jmettraux/quaderno/raw/master/doc/quaderno_0.png"/>

The complete example is at <a href="http://github.com/jmettraux/quaderno/blob/master/public/readme_0.html">http://github.com/jmettraux/quaderno/blob/master/public/readme_0.html</a>.


## having a look

<a href="http://ruote.rubyforge.org/quaderno/viewer.html">http://ruote.rubyforge.org/quaderno/viewer.html</a>


## getting started

    git clone git://github.com/jmettraux/quaderno.git

then open, with your browser, the file

    public/viewer.html

the default template and data are located in :

    public/template_0.txt
    public/data_0.txt


## the elements

Maybe it's easier to have a look at a [full example](http://ruote.rubyforge.org/quaderno/viewer.html?translations=true&sample=9).

element-name id "text" value [values] "title" disabled

* group
* box
* tabs
* tab
* text

* checkbox
* text_input
* text_area
* select

* date
* date_ymd
* date_y
* date_ym
* date_md

End of line comments starting with // or # are supported.


### macros

Expanded at parse time.

    define customer
      text "customer"
      text_input .name
      text_input .city
    
    tabs
      tab "a"
        box customers.*^
          customer
      tab "b"
        text "nada"


## extending

TODO : Quaderno.renderers and Quaderno.hooks


## testing

requires spidermonkey or (prerefably, better stack traces) rhino.

    ruby test/test.rb

one test at a time

    ruby test/test.rb x

where x is the number (integer) of the test. For example

    ruby test/test.rb 0

will run the test test/qt_0_parse.js


## credits

Jamandru Reynolds - <a href="http://geometron.net">http://geometron.net/</a> - CSS and general appearance

Claudio Petasecca Donati - <a href="http://github.com/etapeta">http://github.com/etapeta</a> - testing

Torsten Schoenebaum - <a href="http://github.com/tosch">http://github.com/tosch</a> - testing on webkit


The amazing jQuery - <a href="http://jquery.com/">http://jquery.com</a>


## license

MIT

