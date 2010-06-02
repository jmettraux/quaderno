
file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');


// 0

var ta = [ 'tabs', {}, [
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

assertEqual(ta, render_and_serialize(ta));

// 1

var tb = [ 'tabs', {}, [
  [ 'group', { 'label': 'tab.a' }, [
    [ 'text', { 'label': 'this is a message' }, [] ],
    [ 'text_input', { 'label': 'colour', 'id': 'colour', 'title': 'title.nada', 'value': 'azure' }, [] ] ] ] ] ];

assertEqual(tb, render_and_serialize(tb));

// 2

var tc = [ 'tabs', {}, [
  [ 'group', { 'label': 'tab.a' }, [
    [ 'text', { 'label': 'this is a message' }, [] ],
    [ 'text_input', { 'label': 'colour', 'id': 'colour', 'title': 'title.nada' }, [] ] ] ] ] ];

assertEqual(tb, render_and_serialize(tc, { 'colour': 'azure' }));

