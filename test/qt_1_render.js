
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

//assertEqual(
//  ["html",{"class":""},[
//    ["div",{"class":""},[]],
//    ["body",{"class":""},[
//      ["div",{"class":"quad_root"},[
//        ["div",{"class":"quad_element"},[
//          ["input",{"class":"quad_id","type":"hidden","value":"customer"},[]],
//          ["input",{"class":"quad_type","type":"hidden","value":"text"},[]],
//          ["div",{"class":"quad_key quad_text"},["kanazawa"]]]]]]]]]],
//  document.documentElement.toArray());

assertEqual(
  ["div",{"id":"quad","class":"quad_root"},[
    ["div",{"class":"quad_element"},[
      ["input",{"class":"quad_id","type":"hidden","value":"customer"},[]],
      ["input",{"class":"quad_type","type":"hidden","value":"text"},[]],
      ["span",{"class":"quad_key"},["customer"]],
      ["span",{"class":"quad_value quad_text"},["kanazawa"]]]]]],
  $('.quad_root')[0].toArray());

