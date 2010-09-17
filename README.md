
# quaderno

A mini form templating system in javascript.


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

will run the test test/qt_0_identify.js


## credits

Jamandru Reynolds - <a href="http://geometron.net">http://geometron.net/</a> - CSS and general appearance

Torsten Schoenebaum - <a href="http://github.com/tosch">http://github.com/tosch</a> - testing on webkit

The amazing jQuery - <a href="http://jquery.com/">http://jquery.com</a>


## license

MIT

