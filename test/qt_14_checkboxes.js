
file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');


// 0

var te0 =
  [ 'group', { 'id': 'projects.' }, [
    [ 'checkbox', { 'label': 'project', }, [] ]
  ] ];
var data = {
  'projects' : [
    { 'value': '123', 'text': 'mimosa' },
    { 'value': '456', 'text': 'magnolia', 'checked': true },
    { 'value': '789', 'text': 'tulip' }
  ]
};

assertEqual(data, render_and_produce(te0, data));
assertEqual(te0, render_and_serialize(te0, data, { 'mode': 'edit' } ));

