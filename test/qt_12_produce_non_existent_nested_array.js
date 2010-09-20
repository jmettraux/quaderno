
//
// testing quaderno
//
// Mon Sep 20 20:50:34 JST 2010
//

file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');

// 0

var template = " \n\
group \n\
  box customers.+ \n\
    text_input .name \n\
    box .opinions.+ \n\
      text_input .comment \n\
"
var data = {};

Quaderno.render('quad', template, data, {});

//print($('.quad_root')[0]);
//print("================================");

var addButton = $('.quad_plus_button')[0];
Quaderno.hooks.addToArray(addButton);

//print($('.quad_root')[0]);

assertEqual(
  { "customers": [ { 'name': '' } ] },
  Quaderno.produce('quad'));

addButton = $('.quad_plus_button')[0];
Quaderno.hooks.addToArray(addButton);

assertEqual(
  { "customers": [ { 'name': '', 'opinions': [ { "comment": "" } ] } ] },
  Quaderno.produce('quad'));

