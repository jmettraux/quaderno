
//
// testing quaderno
//
// Thu Sep 16 09:57:28 JST 2010
//

file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');


// translations

var template = " \n\
group customer \n\
  text .name \n\
  text_input .name \n\
"
var data = { 'customer': { 'name': 'danza' } };
var translations = { 'en': { 'customer': { 'name': 'Name' } } };

Quaderno.render('quad', template, data, { 'translations': translations });

assertEqual(
  ["div",{"class":"quad_root"},[
    ["div",{"class":"quad_element"},[
      ["input",{"class":"quad_id","type":"hidden","value":"customer"},[]],
      ["input",{"class":"quad_type","type":"hidden","value":"group"},[]],
      ["div",{"class":"quad_element"},[
        ["input",{"class":"quad_id","type":"hidden","value":".name"},[]],
        ["input",{"class":"quad_type","type":"hidden","value":"text"},[]],
        ["span",{"class":"quad_key"},["Name"]],
        ["span",{"class":"quad_value quad_text"},["danza"]]]],
      ["div",{"class":"quad_element"},[
        ["input",{"class":"quad_id","type":"hidden","value":".name"},[]],
        ["input",{"class":"quad_type","type":"hidden","value":"text_input"},[]],
        ["span",{"class":"quad_key"},["Name"]],
        ["input",{"class":"quad_value","type":"text","onKeyPress":"Quaderno.handlers.stackOnKey(this);","onChange":"Quaderno.handlers.stackOnChange(this);","value":"danza"},[]]]]]]]],
  $('.quad_root')[0].toArray());

