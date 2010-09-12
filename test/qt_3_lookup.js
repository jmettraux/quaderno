
//
// testing quaderno
//
// Sun Sep 12 17:10:01 JST 2010
//

file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');

var l = Quaderno._lookup;
var s = function(data, key, value) {
  var d = JSON.parse(JSON.stringify(data));
  Quaderno._set(d, key, value);
  return d;
}

var d = {
  'destination': 'Abu Dhabi',
  'items': [ 'wallet', 'watch' ],
};

// 0

assertEqual('Abu Dhabi', l(d, 'destination'));
assertEqual([ 'wallet', 'watch' ], l(d, 'items'));
assertEqual('watch', l(d, 'items.1'));
assertEqual(undefined, l(d, 'items.2'));

// 1

var dd;

dd = s(d, 'destination', 'Mumbai');
assertEqual('Mumbai', l(dd, 'destination'));

