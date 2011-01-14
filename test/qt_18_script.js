
//
// testing quaderno
//
// Fri Jan 14 10:14:17 JST 2011
//

file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');


// javascript end block

var s = " \n\
box \n\
  text \"nada\" \n\
javascript \n\
  function func (source) { \n\
  } \n\
";

var tree = Quaderno.parse(s);

assertEqual(
  ["box",{},[
    ["text",{"text":"nada"},[]]]],
  tree);
assertEqual(
  "function func (source) { \n  }",
  $.trim(tree.javascript));

