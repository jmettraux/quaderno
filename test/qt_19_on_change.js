
//
// testing quaderno
//
// Fri Jan 14 16:35:21 JST 2011
//

file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');

// 0

var template = " \n\
group \n\
  text_input customer onchange=func\n\
\n\
javascript \n\
  function func(source) {} \n\
"
var data = { "customer": "khalif" };

Quaderno.render('quad', template, data, {});

assertEqual(
  ["div",{"class":"quad_root","id":"quad"},[
    ["div",{"class":"quad_element"},[
      ["input",{"class":"quad_type","type":"hidden","value":"group"},[]],
      ["input",{"class":"quad_template","type":"hidden","value":"[\"group\",{},[[\"text_input\",{\"_id\":\"customer\",\"onchange\":\"func\"},[]],[\"javascript\",{\"code\":\"  function func(source) {} \\n\"},[]]]]"},[]],
      ["div",{"class":"quad_element"},[
        ["input",{"class":"quad_id","type":"hidden","value":"customer"},[]],
        ["input",{"class":"quad_type","type":"hidden","value":"text_input"},[]],
        ["input",{"class":"quad_template","type":"hidden","value":"[\"text_input\",{\"_id\":\"customer\",\"onchange\":\"func\"},[]]"},[]],
        ["span",{"class":"quad_key"},["customer"]],
        ["input",{"class":"quad_value","type":"text","onKeyPress":"Quaderno.handlers.stackOnKey(this);","onChange":"Quaderno.handlers.stackOnChange(this);; func($(this).parent(\".quad_element\")[0]);","value":"khalif","id":"quad:quad:customer"},[]]]]]]]],
  $('.quad_root')[0].toArray());

