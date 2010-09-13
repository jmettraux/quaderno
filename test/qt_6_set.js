
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
};

var d = {
  'destination': 'Abu Dhabi',
  'items': [ 'wallet', 'watch' ],
};

// 0

var dd;

dd = s(d, 'destination', 'Mumbai');
assertEqual('Mumbai', l(dd, 'destination'));

dd = s(d, 'items.0', 'notes');
assertEqual([ 'notes', 'watch' ], l(dd, 'items'));

dd = s(d, 'items.2', 'keys');
assertEqual([ 'wallet', 'watch', 'keys' ], l(dd, 'items'));

// 1

d = {
  'customers': [
    { 'name': 'abram' },
    { 'name': 'bilbo' }
  ]
};

dd = s(d, 'customers.1.name', 'morgoth');

assertEqual('abram', l(dd, 'customers.0.name'));
assertEqual('morgoth', l(dd, 'customers.1.name'));

dd = s(d, 'customers.2.name', 'morgoth');


// 2

d = {
  'listA': [
    [ 'a' ],
    [ 'b' ],
    [ 'c' ]
  ]
};

assertEqual('c', l(d, 'listA.2.0'));

dd = s(d, 'listA.3.0', 'nada');

assertEqual('nada', l(dd, 'listA.3.0'));

// 3

d = {
  'listA': [
    [ { 'name': 'a' } ],
    [ { 'name': 'b' } ]
  ]
};

assertEqual('b', l(d, 'listA.1.0.name'));

dd = s(d, 'listA.2.0.name', 'C');

assertEqual('C', l(dd, 'listA.2.0.name'));

