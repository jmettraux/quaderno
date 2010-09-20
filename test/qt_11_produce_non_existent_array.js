
//
// testing quaderno
//
// Mon Sep 20 20:34:20 JST 2010
//

file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');

// 0

var template = " \n\
group \n\
  box customers.+ \n\
    text_input .name \n\
    text_input .city \n\
"
var data = {};

Quaderno.render('quad', template, data, {});

//print($('.quad_root')[0]);
//print($('.quad_plus_button')[0]);

var addButton = $('.quad_plus_button')[0];
Quaderno.hooks.addToArray(addButton);

assertEqual(
  { "customers": [
    { 'name': '', 'city': '' } ] },
  Quaderno.produce('quad'));

