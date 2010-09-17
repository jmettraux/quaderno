
//
// testing quaderno
//
// Sun Sep 12 22:40:20 JST 2010
//

file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');

// 0

var template = " \n\
group \n\
  box customers.+ \n\
    text_input .name \n\
"
var data = { "customers": [
  { 'name': 'alfred' },
  { 'name': 'bob' } ] };

Quaderno.render('quad', template, data, {});

//print($('.quad_root')[0]);
//print(JSON.stringify($('.quad_root')[0].toArray()));

assertEqual(
  ["div",{"class":"quad_root"},[
    ["div",{"class":"quad_element"},[
      ["input",{"class":"quad_type","type":"hidden","value":"group"},[]],
      ["div",{"class":"quad_element"},[
        ["input",{"class":"quad_id","type":"hidden","value":"customers"},[]],
        ["input",{"class":"quad_type","type":"hidden","value":"_array"},[]],
        ["input",{"class":"quad_array_template","type":"hidden","value":"[\"box\",{\"id\":\"customers.+\"},[[\"text_input\",{\"id\":\".name\"},[]]]]"},[]],
        ["div",{"class":"quad_element quad_box"},[
          ["input",{"class":"quad_id","type":"hidden","value":".0"},[]],
          ["input",{"class":"quad_type","type":"hidden","value":"box"},[]],
          ["div",{"class":"quad_element"},[
            ["input",{"class":"quad_id","type":"hidden","value":".name"},[]],
            ["input",{"class":"quad_type","type":"hidden","value":"text_input"},[]],
            ["span",{"class":"quad_key"},[".name"]],
            ["input",{"class":"quad_value","type":"text","onKeyPress":"Quaderno.hooks.stackOnKey(this);","onChange":"Quaderno.hooks.stackOnChange(this);","value":"alfred"},[]]]],
          ["a",{"class":"quad_copy_button array_duplicate_button quad_button","href":"","onClick":"Quaderno.hooks.duplicateInArray(this); return false;"},[]]]],
        ["div",{"class":"quad_element quad_box"},[
          ["input",{"class":"quad_id","type":"hidden","value":".0"},[]],
          ["input",{"class":"quad_type","type":"hidden","value":"box"},[]],
          ["div",{"class":"quad_element"},[
            ["input",{"class":"quad_id","type":"hidden","value":".name"},[]],
            ["input",{"class":"quad_type","type":"hidden","value":"text_input"},[]],
            ["span",{"class":"quad_key"},[".name"]],
            ["input",{"class":"quad_value","type":"text","onKeyPress":"Quaderno.hooks.stackOnKey(this);","onChange":"Quaderno.hooks.stackOnChange(this);","value":"bob"},[]]]],
          ["a",{"class":"quad_copy_button array_duplicate_button quad_button","href":"","onClick":"Quaderno.hooks.duplicateInArray(this); return false;"},[]]]],
        ["a",{"class":"quad_plus_button quad_button","href":"","onClick":"Quaderno.hooks.addToArray(this); return false;"},[]]]]]]]],
  $('.quad_root')[0].toArray());

//assertEqual(
//  { "customers": [
//    { 'name': 'alfred', 'city': 'copenhague' },
//    { 'name': 'bob', 'city': 'bristol' } ] },
//  Quaderno.produce('quad'));

var button = $('.quad_plus_button')[0];
Quaderno.hooks.addToArray(button);

assertEqual(
  {"customers":[{"name":"alfred"},{"name":"bob"},{"name":""}]},
  Quaderno.produce('quad'));

