
//
// testing quaderno
//
// Thu Jan 13 21:47:33 JST 2011
//

file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');

// 0

var template = " \n\
group \n\
  text_input customer id=king\n\
  text_input city class=city\n\
"
var data = { "customer": "oosama" };

Quaderno.render('quad', template, data, {});

//print(document.documentElement);
//print(JSON.stringify(document.documentElement.toArray()));

assertEqual(
  ["div",{"class":"quad_root","id":"quad"},[
    ["div",{"class":"quad_element"},[
      ["input",{"class":"quad_type","type":"hidden","value":"group"},[]],
      ["input",{"class":"quad_template","type":"hidden","value":"[\"group\",{},[[\"text_input\",{\"_id\":\"customer\",\"id\":\"king\"},[]],[\"text_input\",{\"_id\":\"city\",\"class\":\"city\"},[]]]]"},[]],
      ["div",{"class":"quad_element","id":"king"},[
        ["input",{"class":"quad_id","type":"hidden","value":"customer"},[]],
        ["input",{"class":"quad_type","type":"hidden","value":"text_input"},[]],
        ["input",{"class":"quad_template","type":"hidden","value":"[\"text_input\",{\"_id\":\"customer\",\"id\":\"king\"},[]]"},[]],
        ["span",{"class":"quad_key"},["customer"]],
        ["input",{"class":"quad_value","type":"text","onKeyPress":"Quaderno.handlers.stackOnKey(this);","onChange":"Quaderno.handlers.stackOnChange(this);","value":"oosama","id":"quad:quad:customer"},[]]]],
      ["div",{"class":"quad_element city"},[
        ["input",{"class":"quad_id","type":"hidden","value":"city"},[]],
        ["input",{"class":"quad_type","type":"hidden","value":"text_input"},[]],
        ["input",{"class":"quad_template","type":"hidden","value":"[\"text_input\",{\"_id\":\"city\",\"class\":\"city\"},[]]"},[]],
        ["span",{"class":"quad_key"},["city"]],
        ["input",{"class":"quad_value","type":"text","onKeyPress":"Quaderno.handlers.stackOnKey(this);","onChange":"Quaderno.handlers.stackOnChange(this);","value":"","id":"quad:quad:city"},[]]]]]]]],
  $('.quad_root')[0].toArray());

