
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
  'opinions': [
    { 'fp': 'cornflakes', 'object': 'price' }
  ]
};
var teu =
  [ 'group', { 'id': 'opinions.+' }, [
    [ 'group', {}, [
      [ 'text', { 'label': 'opinion' }, [] ],
      [ 'text_input', { 'label': 'financial product', 'id': '.fp', 'value': 'cornflakes' }, [] ],
      [ 'text_input', { 'label': 'object', 'id': '.object', 'value': 'price' }, [] ]
    ] ]
  ] ];

assertEqual(
  teu,
  render_and_serialize(te0, data, { 'mode': 'use' } ));

assertEqual(
  { 'opinions': [ { 'fp': 'cornflakes', 'object': 'price' } ] },
  Quaderno.produce('quad'));

//var opinion = document._root()._path('div > div > div', 1)
var opinion = path('div > div > div', 1)
var copinion = opinion.cloneNode(true);
opinion.parentNode.appendChild(copinion);

var fp = copinion._path('div > div', 2);
var fpvalue = fp._path('div > input', 3);
fpvalue.value = 'jerky';

assertEqual(
  [ 'group', { 'id': 'opinions.+' }, [
    [ 'group', {}, [
      [ 'text', { 'label': 'opinion' }, [] ],
      [ 'text_input', { 'label': 'financial product', 'id': '.fp', 'value': 'cornflakes' }, [] ],
      [ 'text_input', { 'label': 'object', 'id': '.object', 'value': 'price' }, [] ]
    ] ],
    [ 'group', {}, [
      [ 'text', { 'label': 'opinion' }, [] ],
      [ 'text_input', { 'label': 'financial product', 'id': '.fp', 'value': 'jerky' }, [] ],
      [ 'text_input', { 'label': 'object', 'id': '.object', 'value': 'price' }, [] ]
    ] ]
  ] ],
  Quaderno.serialize('quad'));

assertEqual(
  { 'opinions': [
    { 'fp': 'cornflakes', 'object': 'price' },
    { 'fp': 'jerky', 'object': 'price' }
  ] },
  Quaderno.produce('quad'));

