
//
// testing quaderno
//
// Sat Sep 11 22:29:13 JST 2010
//

file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');

// 0

var template = "  \n\
text customers.     \n\
"
var data = { "customers": [ "alice", "bob", "charly" ] };

Quaderno.render('quad', template, data, {});

//print($('.quad_root')[0]);
//print(JSON.stringify($('.quad_root')[0].toArray()));

assertEqual(
  ["div",{"class":"quad_root"},[
    ["div",{"class":"quad_element"},[
      ["input",{"class":"quad_id","type":"hidden","value":"customers"},[]],
      ["input",{"class":"quad_type","type":"hidden","value":"_array"},[]],
      ["input",{"class":"quad_array_template","type":"hidden","value":"[\"text\",{\"id\":\"customers.\"},[]]"},[]],
      ["div",{"class":"quad_element"},[
        ["input",{"class":"quad_id","type":"hidden","value":".0"},[]],
        ["input",{"class":"quad_type","type":"hidden","value":"text"},[]],
        ["span",{"class":"quad_key"},[".0"]],
        ["span",{"class":"quad_value quad_text"},["alice"]]]],
      ["div",{"class":"quad_element"},[
        ["input",{"class":"quad_id","type":"hidden","value":".0"},[]],
        ["input",{"class":"quad_type","type":"hidden","value":"text"},[]],
        ["span",{"class":"quad_key"},[".0"]],
        ["span",{"class":"quad_value quad_text"},["bob"]]]],
      ["div",{"class":"quad_element"},[
        ["input",{"class":"quad_id","type":"hidden","value":".0"},[]],
        ["input",{"class":"quad_type","type":"hidden","value":"text"},[]],
        ["span",{"class":"quad_key"},[".0"]],
        ["span",{"class":"quad_value quad_text"},["charly"]]]]]]]],
  $('.quad_root')[0].toArray());

