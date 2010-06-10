
file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');


function i (path) {
  var i = Quaderno._identify(path);
  return [ i.className, i.id, i.tagName ];
}

assertEqual([ 'argh', null, null ], i('.argh'));
assertEqual([ 'argh nada', null, null ], i('.argh.nada'));
assertEqual([ 'argh nada', null, null ], i('.argh .nada'));

assertEqual([ null, 'argh', null ], i('#argh'));

assertEqual([ null, null, 'table' ], i('table'));

