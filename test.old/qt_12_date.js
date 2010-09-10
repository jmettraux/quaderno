
file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');


// 0

var te0 =
  [ 'group', {}, [
    [ 'date', {}, [] ],
    [ 'date_md', {}, [] ],
    [ 'date', { 'id': 'date0' }, [] ],
    [ 'date_md', { 'id': 'date1' }, [] ]
  ] ];
var data = {
  'date0': '2013/06/25',
  'date1': '06/25'
};

var teu =
  [ 'group', {}, [
    [ 'date', { 'value': '2010//' }, [] ], // FIXME
    [ 'date_md', { 'value': '/' }, [] ], // FIXME
    [ 'date', { 'id': 'date0', 'value': '2013/6/25' }, [] ],
    [ 'date_md', { 'id': 'date1', 'value': '6/25' }, [] ]
  ] ];


assertEqual(
  te0,
  render_and_serialize(te0, data, { 'mode': 'edit' } ));

assertEqual(
  teu,
  render_and_serialize(te0, data, { 'mode': 'use' } ));

