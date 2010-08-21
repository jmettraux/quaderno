
file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');


// 0

var te0 =
  [ 'group', { 'id': 'projects.' }, [
    [ 'checkbox', { 'label': 'project', }, [] ]
  ] ];
var data0 = {
  'projects' : [
    { 'value': '123', 'text': 'mimosa' },
    { 'value': '456', 'text': 'magnolia', 'checked': true },
    { 'value': '789', 'text': 'tulip' }
  ]
};

assertEqual(data0, render_and_produce(te0, data0));
assertEqual(te0, render_and_serialize(te0, data0, { 'mode': 'edit' } ));


// 1

var te1 =
  [ 'group', { 'id': 'annual_audit.more' }, [
    [ 'checkbox',
      { 'label': 'Private', 'title': 'Private', 'id':'.private', 'value':'' },
      [] ]
  ] ];
var data1 = { 'annual_audit': { 'more': {} } };

assertEqual(
  { 'annual_audit': { 'more': { 'private': {} } } },
  render_and_produce(te1, data1));


// 2

var te2 =
  [ 'group', { 'id': 'annual_audit.more' }, [
    [ 'checkbox',
      { 'label': 'Private', 'title': 'Private', 'id':'.private', 'value':'' },
      [] ]
  ] ];
var data2 = { 'annual_audit': { 'more': { 'private': { 'checked': true } } } };

document = Document();
Quaderno.render('quad', te2, data2, { 'mode': 'use' });

var e = document._path('div > div > div', 1);
var checkbox = e._path('div > input', 4);
//print(checkbox);

assertEqual('checked', checkbox.getAttribute('checked'));

assertEqual(
  { 'annual_audit': { 'more': { 'private': { 'checked': true } } } },
  Quaderno.produce('quad'));

checkbox.removeAttribute('checked')
//print(checkbox);

assertEqual(
  { 'annual_audit': { 'more': { 'private': {} } } },
  Quaderno.produce('quad'));

