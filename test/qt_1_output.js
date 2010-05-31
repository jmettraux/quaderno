
file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + "/base.js");


function o (checklist) {
  document._clear();
  Quaderno.render('quad', checklist);
  return Quaderno.serialize('quad');
}

// 0

var template = [ 'tabs', {}, [
  [ 'group', { 'label': 'tab.a' }, [
    [ 'text', { 'label': 'this is a message' }, [] ],
    [ 'text_input', { 'label': 'colour', 'id': 'colour', 'title': 'title.nada' }, [] ]
  ] ],
  [ 'group', { 'label': 'tab.b' }, [
    [ 'text', { 'label': 'this is a message' }, [] ],
    [ 'text_input', { 'label': 'location', 'id': 'location' }, [] ]
  ] ],
  [ 'group', { 'label': 'tab.c' }, [
    [ 'text', { 'label': 'tab.c.text' }, [] ],
    [ 'text_input', { 'label': 'owner', 'id': 'stuff.owner' }, [] ]
  ] ] ]
];

assertEqual(template, o(template));

// 1

var template = [ 'tabs', {}, [
  [ 'group', { 'label': 'tab.a' }, [
    [ 'text', { 'label': 'this is a message' }, [] ],
    [ 'text_input', { 'label': 'colour', 'id': 'colour', 'title': 'title.nada', 'value': 'nada' }, [] ] ] ] ] ];

assertEqual(template, o(template));

