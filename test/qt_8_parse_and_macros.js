
//
// testing quaderno
//
// Tue Sep 14 10:35:09 JST 2010
//

file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');


// macros

var s = " \n\
define customer \n\
  text_input .name \n\
  text_input .city \n\
box customers. \n\
  customer \n\
";

assertEqual(
  ["box",{"id":"customers."},[
    ["text_input",{"id":".name"},[]],
    ["text_input",{"id":".city"},[]]]],
  Quaderno.parse(s));


// nesting ?

s = " \n\
box customers. \n\
  define customer \n\
    text_input .name \n\
    text_input .city \n\
  customer \n\
  customer \n\
";

assertEqual(
  ["box",{"id":"customers."},[
    ["text_input",{"id":".name"},[]],
    ["text_input",{"id":".city"},[]],
    ["text_input",{"id":".name"},[]],
    ["text_input",{"id":".city"},[]]]],
  Quaderno.parse(s));

