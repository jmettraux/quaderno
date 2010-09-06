
# quaderno

A mini form templating system in javascript.

Quaderno assumes, three modes of operations.

* edit - building, modifiying the form
* use - filling the form
* view - read-only mode

Quaderno, for these three modes, takes as input a *template* and some *data* (a Javascript Object instance). It then renders the form.


## samples

There are some <a href="http://ruote.rubyforge.org/quaderno/">sample pages</a>. The most complete one is <a href="http://ruote.rubyforge.org/quaderno/page2.html">page 2</a> (though it's overloaded with helper white on black data rendering).


## current limitations

only those 'types' :

* text
* text_input
* group
* tabs


## usage

A *form* is represented as a tree structure :

    var template = [ 'tabs', {}, [
      [ 'group', { 'label': 'tab.a' }, [
        [ 'text', { 'label': 'this is a message' }, [] ],
        [ 'text_input', { 'label': 'colour', 'id': 'colour', 'title': 'title.nada' }, [] ]
      ] ],
      [ 'group', { 'label': 'tab.b' }, [
        [ 'text', { 'label': 'this is a message' }, [] ],
        [ 'text_input', { 'label': 'location', 'id': 'location' }, [] ]
      ] ],
      [ 'group', { 'label': 'tab.c' }, [
        [ 'text', { 'label': 'tab.c.text' }, [] ],
        [ 'text_input', { 'label': 'owner', 'id': 'stuff.owner' }, [] ]
      ] ] ]
    ];

Each node in the tree takes the form

    [ type, { ... attributes ... }, [ ... child nodes ... ] ]

Data simply looks like 

    var data = {
      'colour': 'blue', 'customers': [ 'alice', 'bob' ]
    };

Given an HTML div

    <div id="quad" class="quad_root"></div>

this javascript invocation

    Quaderno.render('quad', template, data, { 'mode': 'edit' });

will render as ('edit' mode)

<a href="http://github.com/jmettraux/quaderno/raw/master/doc/edition.png"><img src="http://github.com/jmettraux/quaderno/raw/master/doc/edition.png" width="70%" /></a>

and

    Quaderno.render('quad', template, data, { 'mode': 'use' });

will render as ('use' mode)

<a href="http://github.com/jmettraux/quaderno/raw/master/doc/using.png"><img src="http://github.com/jmettraux/quaderno/raw/master/doc/using.png" /></a>


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

