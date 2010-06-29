
file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');


// 0

var te0 =
  [ 'group', { 'id': 'colours.' }, [
    [ 'text', { 'label': 'colour' }, [] ],
  ] ];
var data = {
  'colours': [ 'red', 'green', 'blue' ]
};

var teu =
  [ 'group', { 'id': 'colours.' }, [
    [ 'text', { 'label': 'colour', 'value': 'red' }, [] ],
    [ 'text', { 'label': 'colour', 'value': 'green' }, [] ],
    [ 'text', { 'label': 'colour', 'value': 'blue' }, [] ]
  ] ];

render_and_serialize(te0, data, { 'mode': 'use' } );

var texts = document._path('div > div > div > .quad_text');

assertEqual('red', texts[0].childNodes[0]);
assertEqual('green', texts[1].childNodes[0]);
assertEqual('blue', texts[2].childNodes[0]);

