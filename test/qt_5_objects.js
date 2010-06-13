
file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');


// 0

var te0 =
  [ 'group', { 'id': 'customer' }, [
    [ 'text_input', { 'label': 'name', 'id': '.name' }, [] ],
    [ 'text_input', { 'label': 'age', 'id': '.age' }, [] ]
  ] ];
var data = {
  'customer': { 'name': 'john', 'age': '30' } };

var teu =
  [ 'group', { 'id': 'customer' }, [
    [ 'text_input', { 'label': 'name', 'id': '.name', 'value': 'john' }, [] ],
    [ 'text_input', { 'label': 'age', 'id': '.age', 'value': '30' }, [] ]
  ] ];

assertEqual(teu, render_and_serialize(te0, data, { 'mode': 'use' } ));
assertEqual(teu, render_and_serialize(te0, data, { 'mode': 'view' } ));

assertEqual(te0, render_and_serialize(te0, data, { 'mode': 'edit' } ));

assertEqual(data, render_and_produce(te0, data));

