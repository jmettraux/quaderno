
//
// testing quaderno
//
// Tue Nov 16 09:10:57 JST 2010
//

file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');

// 0

var template = " \n\
box \n\
  select rating \"rating\" [ratings] \n\
  select country \"country\" [countries] \n\
  select city \"city\" [cities] \n\
";
var data = {
  'ratings': [ 'alpha', 'bravo' ],
  'countries': [ 'country.burma', 'country.thailand' ],
  'cities': [ [ 'city.tokyo', 'NRT' ], [ 'zurich', 'ZRH' ] ]
};
var translations = {
  'en': {
    'country': { 'burma': 'Burma' },
    'city' : { 'tokyo': 'Tōkyō' } } };

//Quaderno.render('quad', template, data, {});
Quaderno.render('quad', template, data, { 'translations': translations });

assertEqual(
  ["div",{"class":"quad_root","id":"quad"},[
    ["div",{"class":"quad_element quad_box"},[
      ["input",{"class":"quad_type","type":"hidden","value":"box"},[]],
      ["input",{"class":"quad_template","type":"hidden","value":"[\"box\",{},[[\"select\",{\"_id\":\"rating\",\"text\":\"rating\",\"values\":\"ratings\"},[]],[\"select\",{\"_id\":\"country\",\"text\":\"country\",\"values\":\"countries\"},[]],[\"select\",{\"_id\":\"city\",\"text\":\"city\",\"values\":\"cities\"},[]]]]"},[]],
      ["div",{"class":"quad_element"},[
        ["input",{"class":"quad_id","type":"hidden","value":"rating"},[]],
        ["input",{"class":"quad_type","type":"hidden","value":"select"},[]],
        ["input",{"class":"quad_template","type":"hidden","value":"[\"select\",{\"_id\":\"rating\",\"text\":\"rating\",\"values\":\"ratings\"},[]]"},[]],
        ["span",{"class":"quad_key"},["rating"]],
        ["select",{"class":"quad_value","onFocus":"this.previousValue = this.value;","onChange":"Quaderno.handlers.stackOnChange(this);","id":"quad:quad:rating"},[
          ["option",{"class":"","value":"alpha"},["alpha"]],
          ["option",{"class":"","value":"bravo"},["bravo"]]]]]],
      ["div",{"class":"quad_element"},[
        ["input",{"class":"quad_id","type":"hidden","value":"country"},[]],
        ["input",{"class":"quad_type","type":"hidden","value":"select"},[]],
        ["input",{"class":"quad_template","type":"hidden","value":"[\"select\",{\"_id\":\"country\",\"text\":\"country\",\"values\":\"countries\"},[]]"},[]],
        ["span",{"class":"quad_key"},["country"]],
        ["select",{"class":"quad_value","onFocus":"this.previousValue = this.value;","onChange":"Quaderno.handlers.stackOnChange(this);","id":"quad:quad:country"},[
          ["option",{"class":"","value":"burma"},["Burma"]],
          ["option",{"class":"","value":"country.thailand"},["country.thailand"]]]]]],
      ["div",{"class":"quad_element"},[
        ["input",{"class":"quad_id","type":"hidden","value":"city"},[]],
        ["input",{"class":"quad_type","type":"hidden","value":"select"},[]],
        ["input",{"class":"quad_template","type":"hidden","value":"[\"select\",{\"_id\":\"city\",\"text\":\"city\",\"values\":\"cities\"},[]]"},[]],
        ["span",{"class":"quad_key"},["city"]],
        ["select",{"class":"quad_value","onFocus":"this.previousValue = this.value;","onChange":"Quaderno.handlers.stackOnChange(this);","id":"quad:quad:city"},[
          ["option",{"class":"","value":"NRT"},["Tōkyō"]],
          ["option",{"class":"","value":"ZRH"},["zurich"]]]]]]]]]],
  $('.quad_root')[0].toArray());

