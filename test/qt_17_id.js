
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
"
var data = { "customer": "oosama" };

Quaderno.render('quad', template, data, {});

//print(document.documentElement);
//print(JSON.stringify(document.documentElement.toArray()));

assertEqual(
  ["div",{"id":"quad","class":"quad_root"},[
    ["div",{"class":"quad_element"},[
      ["input",{"class":"quad_type","type":"hidden","value":"group"},[]],
      ["div",{"id":"king","class":"quad_element"},[
        ["input",{"class":"quad_id","type":"hidden","value":"customer"},[]],
        ["input",{"class":"quad_type","type":"hidden","value":"text_input"},[]],
        ["span",{"class":"quad_key"},["customer"]],
        ["input",{"id":"quad:quad:customer","class":"quad_value","type":"text","onKeyPress":"Quaderno.handlers.stackOnKey(this);","onChange":"Quaderno.handlers.stackOnChange(this);","value":"oosama"},[]]]]]]]],
  $('.quad_root')[0].toArray());

