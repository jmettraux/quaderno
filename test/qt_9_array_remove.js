
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

//print("===");
//print(document._root());

//print(document._root()._path('div > div > input'));
//print(document._path('div > div > input', 0));
//print(document._path('div > div > div > input', 3));

//var red = document._path('div > div > div', 1);
var red = path('div > div > div', 1);
red.parentNode.removeChild(red);

assertEqual(
  { 'colours': [ 'green', 'blue' ] }, Quaderno.produce('quad'));

