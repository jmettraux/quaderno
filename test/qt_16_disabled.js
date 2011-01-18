
//
// testing quaderno
//
// Tue Jan 11 16:44:59 JST 2011
//

file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');

// 0

var template = " \n\
group \n\
  text_input customer disabled\n\
"
var data = { "customer": "ahomiya" };

Quaderno.render('quad', template, data, {});

//print(document.documentElement);
//print(JSON.stringify(document.documentElement.toArray()));

assertEqual(
  ["div",{"class":"quad_root","id":"quad"},[
    ["div",{"class":"quad_element"},[
      ["input",{"class":"quad_type","type":"hidden","value":"group"},[]],
      ["input",{"class":"quad_template","type":"hidden","value":"[\"group\",{},[[\"text_input\",{\"_id\":\"customer\",\"disabled\":true},[]]]]"},[]],
      ["div",{"class":"quad_element"},[
        ["input",{"class":"quad_id","type":"hidden","value":"customer"},[]],
        ["input",{"class":"quad_type","type":"hidden","value":"text_input"},[]],
        ["input",{"class":"quad_template","type":"hidden","value":"[\"text_input\",{\"_id\":\"customer\",\"disabled\":true},[]]"},[]],
        ["span",{"class":"quad_key"},["customer"]],
        ["input",{"class":"quad_value","type":"text","onKeyPress":"Quaderno.handlers.stackOnKey(this);","onChange":"Quaderno.handlers.stackOnChange(this);","value":"ahomiya","disabled":"disabled","id":"quad:quad:customer"},[]]]]]]]],
  $('.quad_root')[0].toArray());

