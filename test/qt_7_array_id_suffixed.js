
file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');


// 0

var te0 =
  [ 'group', { 'id': 'colours.*^' }, [
    //[ 'text', { 'label': 'choose a colour' }, [] ],
    [ 'text_input', { 'label': 'colour', 'title': 'x' }, [] ]
  ] ];
var data = {
  'colours': [ 'red', 'green', 'blue' ]
};

var teu =
  [ 'group', { 'id': 'colours.*^' }, [
    [ 'text_input', { 'label': 'colour', 'title': 'x', 'value': 'red' }, [] ],
    [ 'text_input', { 'label': 'colour', 'title': 'x', 'value': 'green' }, [] ],
    [ 'text_input', { 'label': 'colour', 'title': 'x', 'value': 'blue' }, [] ]
  ] ];

assertEqual(teu, render_and_serialize(te0, data, { 'mode': 'use' } ));

var elts = document.getElementsByClass('quad_element');
for (var i = 0; i < elts.length; i++) {
  var e = elts[i];
  print(e.tagName + '.' + e.className);
  //print(e);
}

print("===");

//print(document._root());
print(document._root()._path('div > div > input'));
print(document._path('div > div > input'));

//assertEqual(teu, render_and_serialize(te0, data, { 'mode': 'view' } ));
//assertEqual(te0, render_and_serialize(te0, data, { 'mode': 'edit' } ));

