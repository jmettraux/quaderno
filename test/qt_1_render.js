
//
// testing quaderno
//
// Sat Sep 11 21:19:49 JST 2010
//

file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');

// 0

var template = " \n\
text customer \n\
"
var data = { "customer": "kanazawa" };

Quaderno.render('quad', template, data, {});

//print(document.documentElement);
//print(JSON.stringify(document.documentElement.toArray()));

assertEqual(
  ["div",{"class":"quad_root","id":"quad"},[
    ["div",{"class":"quad_element"},[
      ["input",{"class":"quad_id","type":"hidden","value":"customer"},[]],
      ["input",{"class":"quad_type","type":"hidden","value":"text"},[]],
      ["input",{"class":"quad_template","type":"hidden","value":"[\"text\",{\"_id\":\"customer\"},[]]"},[]],
      ["span",{"class":"quad_key"},["customer"]],
      ["span",{"class":"quad_value quad_text"},["kanazawa"]]]]]],
  $('.quad_root')[0].toArray());

