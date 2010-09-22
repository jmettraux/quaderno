
//
// testing quaderno
//
// Fri Sep 17 23:28:56 JST 2010
//

file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');

// 0

var template = " \n\
text_input customer.name \"name\" \n\
"
var data = { "customer": { "name": "kanazawa" } };

Quaderno.render('quad', template, data, {});

//print(document.documentElement);
//print(JSON.stringify(document.documentElement.toArray()));

assertEqual(
  ["div",{"class":"quad_root"},[
    ["div",{"class":"quad_element"},[
      ["input",{"class":"quad_id","type":"hidden","value":"customer.name"},[]],
      ["input",{"class":"quad_type","type":"hidden","value":"text_input"},[]],
      ["span",{"class":"quad_key"},["name"]],
      ["input",{"class":"quad_value","type":"text","onKeyPress":"Quaderno.handlers.stackOnKey(this);","onChange":"Quaderno.handlers.stackOnChange(this);","value":"kanazawa"},[]]]]]],
  $('.quad_root')[0].toArray());

