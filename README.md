
# quaderno

A mini form templating system in javascript.

The rendering all happens in the browser.

    <div id="quad" class="quad_root"></div>
      <!-- the class 'quad_root' is mandatory -->

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

The complete example is at [http://github.com/jmettraux/quaderno/blob/master/public/readme_0.html](http://github.com/jmettraux/quaderno/blob/master/public/readme_0.html), you can [browse it directly](http://ruote.rubyforge.org/quaderno/readme_0.html).

Quaderno takes as input a template (written in a small DSL), a data hash (dictionary) and an optional translations hash. It renders dynamically. The user then interacts with the form, once he is done, the quaderno produce() method can be used to output an updated version of the data.


## having a look

[http://ruote.rubyforge.org/quaderno/viewer.html](http://ruote.rubyforge.org/quaderno/viewer.html)


## getting started

    git clone git://github.com/jmettraux/quaderno.git

then open, with your browser, the file

    public/viewer.html

the default template and data are located in :

    public/template_0.txt
    public/data_0.txt


## the elements

Maybe it's easier to have a look at a [full example](http://ruote.rubyforge.org/quaderno/viewer.html?translations=true&sample=9).

element-name id "text" value [values] "title" disabled/hidden

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


## translations

TODO


## 'define'

Expanded at render time.

    define customer
      text "customer"
      text_input .name
      text_input .city
    
    tabs
      tab "current"
        box customers.*^
          customer
      tab "former"
        box former_customers.*^
          customer


## disabled and hidden

A field can be flagged as 'disabled' or 'hidden' :

    tabs
      tab "a"
        box customers.*^
          text "customer"
          text_input .name hidden # won't show up
          text_input .city
          text_input .county disabled # will be visible but not editable
      tab "b"
        text "nada"


## onQuadernoChange callback

You can bind to any quaderno root a callback :

    $('#quad')[0].onQuadernoChange = function (elt, product) {
      // elt is the elt that was actually changed
      // product is the whole data set, as 'produced'
    };


## the javascript appendix

  box customers.*^
    text_input .name
    text_input .city class=city

  javascript
    $('.city').hide();


## extending (custom types)

TODO : Quaderno.renderers and Quaderno.handlers
       email field example ?


## appearance

see public/stylesheets/quaderno.css


## testing

requires spidermonkey or (prerefably, better stack traces) rhino.

    ruby test/test.rb

one test at a time

    ruby test/test.rb x

where x is the number (integer) of the test. For example

    ruby test/test.rb 0

will run the test test/qt_0_parse.js


## credits

Jamandru Reynolds - [http://geometron.net](http://geometron.net/) - CSS and general appearance

Claudio Petasecca Donati - [https://github.com/etapeta](https://github.com/etapeta) - lots of testing

Torsten Schoenebaum - [https://github.com/tosch](https://github.com/tosch) - testing on webkit

Benjami Yu - [https://github.com/byu](https://github.com/byu) - for the callbacks ideas

Simone Carletti - [https://github.com/weppos](https://github.com/weppos) - lint run

The amazing jQuery - [http://jquery.com/](http://jquery.com)


## license

MIT

