
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


## extending

TODO : Quaderno.renderers and Quaderno.hooks


## the elements

element-name id "text" value [ values ] "title"

* group
* box
* tabs
* tab
* text

* checkbox
* text_input


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

The amazing jQuery ( http://jquery.com/ )


## license

MIT

