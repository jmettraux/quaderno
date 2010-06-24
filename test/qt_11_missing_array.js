
file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');


// 0

var te0 =
  [ 'group', { 'id': 'opinions.+' }, [
    [ 'group', {}, [
      [ 'text', { 'label': 'opinion' }, [] ],
      [ 'text_input', { 'label': 'financial product', 'id': '.fp' }, [] ],
      [ 'text_input', { 'label': 'object', 'id': '.object' }, [] ]
    ] ]
  ] ];
var data = {
};
var teu =
  [ 'group', { 'id': 'opinions.+' }, [
  ] ];

assertEqual(
  teu,
  render_and_serialize(te0, data, { 'mode': 'use' } ));

var h = document._path('div > div > input', 2);

assertEqual(
  [ [ 'group', {}, [
    [ 'text', { 'label': 'opinion' }, [] ],
    [ 'text_input', { 'label': 'financial product', 'id': '.fp' }, [] ],
    [ 'text_input', { 'label': 'object', 'id': '.object' }, [] ]
  ] ] ],
  JSON.parse(h.value));

