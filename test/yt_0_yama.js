
//
// testing quaderno
//
// Sun Sep 19 13:45:21 JST 2010
//

file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + "/base.js");
load(dir + "/../public/js/jagaimo.js");


// int

assertEqual(
  '1\n',
  Yama.toString(1));


// string

assertEqual(
  'hello\n',
  Yama.toString('hello'));


// array

assertEqual(
  '- 1\n- 2\n- car\n',
  Yama.toString([ 1, 2, 'car' ]));


// object

assertEqual(
  'a: b\nc: 4\n',
  Yama.toString({ 'a': 'b', 'c': 4 }));


// nested object

assertEqual('\
- 1\n\
- \n\
  a: b\n\
  c: 4\n\
',
  Yama.toString([ 1, { 'a': 'b', 'c': 4 } ]));


// nested array

assertEqual('\
a: \n\
  - 1\n\
  - 2\n\
c: 3\n\
',
  Yama.toString({ 'a': [ 1, 2 ], 'c': 3 }));


// data_0

assertEqual('\
comments: oh well\n\
destinations: \n\
  - reykjavik\n\
  - oslo\n\
  - gothenburg\n\
customers: \n\
  - \n\
    name: bob\n\
    city: boston\n\
  - \n\
    name: charly\n\
    city: cartage\n\
    active: true\n\
departure: 2011/12/12\n\
audit: \n\
  project: \n\
    id: nada\n\
',
  Yama.toString({
    "comments": "oh well",
    "destinations": [ "reykjavik", "oslo", "gothenburg" ],
    "customers": [
      { "name": "bob", "city": "boston" },
      { "name": "charly", "city": "cartage", "active": true }
    ],
    "departure": "2011/12/12",
    "audit": { "project": { "id": "nada" } }
  }));

