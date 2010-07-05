
file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');


// 0

// array of objects

var te0 =
  [ 'group', { 'id': 'customers.*', 'label': 'customers' }, [
    [ 'group', {}, [
      [ 'text_input', { 'label': 'name', 'id': '.name' }, [] ],
      [ 'text_input', { 'label': 'age', 'id': '.age' }, [] ]
    ] ] ] ];
var data = { 'customers': [] };

assertEqual(
  [ 'group', { 'id': 'customers.*', 'label': 'customers' }, [] ],
  render_and_serialize(te0, data, { 'mode': 'use' } ));

Quaderno.copyLastElement(document._path('div > div', 0));
Quaderno.copyLastElement(document._path('div > div', 0));

var customer0 = document._path('div > div > div', 1);
var name0 = customer0._path('div > div', 1);
var nameIn0 = name0._path('div > input', 3);
nameIn0.value = 'toto';

assertEqual(
  { 'customers': [ { 'name': 'toto' } ] },
  Quaderno.produce('quad'));

