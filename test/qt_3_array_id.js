
file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');


// 0

var te =
  [ 'group', {}, [
    [ 'text', { 'label': 'this is a message' }, [] ],
    [ 'text_input', { 'label': 'colour', 'id': 'colours.', 'title': 'title.nada' }, [] ],
    [ 'group', { 'id': 'customer' }, [
      [ 'text_input', { 'label': 'name', 'id': '.name' }, [] ],
      [ 'text_input', { 'label': 'age', 'id': '.age' }, [] ]
    ] ]
  ] ];
var data = {
  'colours': [ 'red', 'green', 'blue' ],
  'customer': { 'name': 'john', 'age': '30' }
};

assertEqual(te, render_and_serialize(te, data, { 'mode': 'view' } ));
//assertEqual(te, render_and_serialize(te, data, { 'mode': 'edit' } ));

