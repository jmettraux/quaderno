
//
// testing quaderno
//
// Fri Jan 21 09:44:01 JST 2011
//

file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');

// 0

var template = " \n\
define customer \n\
  text \"customer\" \n\
  text_input .name \n\
  text_input .city \n\
 \n\
tabs \n\
  tab \"a\" \n\
    box customers.*^ \n\
      customer \n\
  tab \"b\" \n\
    text \"nada\" \n\
"

var data = { "customers": [
  { "name": "ahomiya", "city": "aoyama" },
  { "name": "futachan", "city": "seaside" }
] };

Quaderno.render('quad', template, data, {});

assertEqual(
  ["div",{"class":"quad_root","id":"quad"},[
    ["div",{"class":"quad_element"},[
      ["input",{"class":"quad_type","type":"hidden","value":"tabs"},[]],
      ["input",{"class":"quad_template","type":"hidden","value":"[\"tabs\",{},[[\"tab\",{\"text\":\"a\"},[[\"box\",{\"_id\":\"customers.*^\"},[[\"customer\",{},[]]]]]],[\"tab\",{\"text\":\"b\"},[[\"text\",{\"text\":\"nada\"},[]]]],[\"define\",{\"_id\":\"customer\"},[[\"text\",{\"text\":\"customer\"},[]],[\"text_input\",{\"_id\":\".name\"},[]],[\"text_input\",{\"_id\":\".city\"},[]]]]]]"},[]],
      ["table",{"class":"quad_tab_group"},[
        ["tr",{"class":"quad_tab_group"},[
          ["td",{"class":"quad_tab quad_selected"},[
            ["a",{"class":"","href":"","onClick":"return Quaderno.handlers.showTab(this.parentNode);"},["a"]]]],
          ["td",{"class":"quad_tab"},[
            ["a",{"class":"","href":"","onClick":"return Quaderno.handlers.showTab(this.parentNode);"},["b"]]]]]],
        ["tr",{"class":"quad_tab_group"},[
          ["td",{"class":"","colSpan":"3"},[
            ["div",{"class":"quad_tab_body"},[
              ["div",{"class":"quad_element"},[
                ["input",{"class":"quad_type","type":"hidden","value":"tab"},[]],
                ["input",{"class":"quad_template","type":"hidden","value":"[\"tab\",{\"text\":\"a\"},[[\"box\",{\"_id\":\"customers.*^\"},[[\"customer\",{},[]]]]]]"},[]],
                ["div",{"class":"quad_element"},[
                  ["input",{"class":"quad_id","type":"hidden","value":"customers"},[]],
                  ["input",{"class":"quad_type","type":"hidden","value":"_array"},[]],
                  ["input",{"class":"quad_template","type":"hidden","value":"[\"box\",{\"_id\":\"customers.*^\"},[[\"customer\",{},[]]]]"},[]],
                  ["div",{"class":"quad_element quad_box"},[
                    ["input",{"class":"quad_id","type":"hidden","value":".0"},[]],
                    ["input",{"class":"quad_type","type":"hidden","value":"box"},[]],
                    ["input",{"class":"quad_template","type":"hidden","value":"[\"box\",{\"_id\":\".0\"},[[\"customer\",{},[]]]]"},[]],
                    ["div",{"class":"quad_element"},[
                      ["input",{"class":"quad_type","type":"hidden","value":"group"},[]],
                      ["input",{"class":"quad_template","type":"hidden","value":"[\"group\",{},[[\"text\",{\"text\":\"customer\"},[]],[\"text_input\",{\"_id\":\".name\"},[]],[\"text_input\",{\"_id\":\".city\"},[]]]]"},[]],
                      ["div",{"class":"quad_element"},[
                        ["input",{"class":"quad_type","type":"hidden","value":"text"},[]],
                        ["input",{"class":"quad_template","type":"hidden","value":"[\"text\",{\"text\":\"customer\"},[]]"},[]],
                        ["div",{"class":"quad_key quad_text"},["customer"]]]],
                      ["div",{"class":"quad_element"},[
                        ["input",{"class":"quad_id","type":"hidden","value":".name"},[]],
                        ["input",{"class":"quad_type","type":"hidden","value":"text_input"},[]],
                        ["input",{"class":"quad_template","type":"hidden","value":"[\"text_input\",{\"_id\":\".name\"},[]]"},[]],
                        ["span",{"class":"quad_key"},[".name"]],
                        ["input",{"class":"quad_value","type":"text","onKeyPress":"Quaderno.handlers.stackOnKey(this);","onChange":"Quaderno.handlers.stackOnChange(this);","value":"ahomiya","id":"quad:quad:customers.0.name"},[]]]],
                      ["div",{"class":"quad_element"},[
                        ["input",{"class":"quad_id","type":"hidden","value":".city"},[]],
                        ["input",{"class":"quad_type","type":"hidden","value":"text_input"},[]],
                        ["input",{"class":"quad_template","type":"hidden","value":"[\"text_input\",{\"_id\":\".city\"},[]]"},[]],
                        ["span",{"class":"quad_key"},[".city"]],
                        ["input",{"class":"quad_value","type":"text","onKeyPress":"Quaderno.handlers.stackOnKey(this);","onChange":"Quaderno.handlers.stackOnChange(this);","value":"aoyama","id":"quad:quad:customers.0.city"},[]]]]]],
                    ["a",{"class":"quad_minus_button array_remove_button quad_button","href":"","onClick":"Quaderno.handlers.removeFromArray(this); return false;"},[]],
                    ["a",{"class":"quad_up_button array_move_button quad_button","href":"","onClick":"Quaderno.handlers.moveInArray(this, \"up\"); return false;"},[]],
                    ["a",{"class":"quad_down_button array_move_button quad_button","href":"","onClick":"Quaderno.handlers.moveInArray(this, \"down\"); return false;"},[]],
                    ["a",{"class":"quad_copy_button array_duplicate_button quad_button","href":"","onClick":"Quaderno.handlers.duplicateInArray(this); return false;"},[]]]],
                  ["div",{"class":"quad_element quad_box"},[
                    ["input",{"class":"quad_id","type":"hidden","value":".0"},[]],
                    ["input",{"class":"quad_type","type":"hidden","value":"box"},[]],
                    ["input",{"class":"quad_template","type":"hidden","value":"[\"box\",{\"_id\":\".0\"},[[\"customer\",{},[]]]]"},[]],
                    ["div",{"class":"quad_element"},[
                      ["input",{"class":"quad_type","type":"hidden","value":"group"},[]],
                      ["input",{"class":"quad_template","type":"hidden","value":"[\"group\",{},[[\"text\",{\"text\":\"customer\"},[]],[\"text_input\",{\"_id\":\".name\"},[]],[\"text_input\",{\"_id\":\".city\"},[]]]]"},[]],
                      ["div",{"class":"quad_element"},[
                        ["input",{"class":"quad_type","type":"hidden","value":"text"},[]],
                        ["input",{"class":"quad_template","type":"hidden","value":"[\"text\",{\"text\":\"customer\"},[]]"},[]],
                        ["div",{"class":"quad_key quad_text"},["customer"]]]],
                      ["div",{"class":"quad_element"},[
                        ["input",{"class":"quad_id","type":"hidden","value":".name"},[]],
                        ["input",{"class":"quad_type","type":"hidden","value":"text_input"},[]],
                        ["input",{"class":"quad_template","type":"hidden","value":"[\"text_input\",{\"_id\":\".name\"},[]]"},[]],
                        ["span",{"class":"quad_key"},[".name"]],
                        ["input",{"class":"quad_value","type":"text","onKeyPress":"Quaderno.handlers.stackOnKey(this);","onChange":"Quaderno.handlers.stackOnChange(this);","value":"futachan","id":"quad:quad:customers.1.name"},[]]]],
                      ["div",{"class":"quad_element"},[
                        ["input",{"class":"quad_id","type":"hidden","value":".city"},[]],
                        ["input",{"class":"quad_type","type":"hidden","value":"text_input"},[]],
                        ["input",{"class":"quad_template","type":"hidden","value":"[\"text_input\",{\"_id\":\".city\"},[]]"},[]],
                        ["span",{"class":"quad_key"},[".city"]],
                        ["input",{"class":"quad_value","type":"text","onKeyPress":"Quaderno.handlers.stackOnKey(this);","onChange":"Quaderno.handlers.stackOnChange(this);","value":"seaside","id":"quad:quad:customers.1.city"},[]]]]]],
                    ["a",{"class":"quad_minus_button array_remove_button quad_button","href":"","onClick":"Quaderno.handlers.removeFromArray(this); return false;"},[]],
                    ["a",{"class":"quad_up_button array_move_button quad_button","href":"","onClick":"Quaderno.handlers.moveInArray(this, \"up\"); return false;"},[]],
                    ["a",{"class":"quad_down_button array_move_button quad_button","href":"","onClick":"Quaderno.handlers.moveInArray(this, \"down\"); return false;"},[]],
                    ["a",{"class":"quad_copy_button array_duplicate_button quad_button","href":"","onClick":"Quaderno.handlers.duplicateInArray(this); return false;"},[]]]],
                  ["a",{"class":"quad_plus_button quad_button","href":"","onClick":"Quaderno.handlers.addToArray(this); return false;"},[]]]]]],
              ["div",{"class":"quad_element"},[
                ["input",{"class":"quad_type","type":"hidden","value":"tab"},[]],
                ["input",{"class":"quad_template","type":"hidden","value":"[\"tab\",{\"text\":\"b\"},[[\"text\",{\"text\":\"nada\"},[]]]]"},[]],
                ["div",{"class":"quad_element"},[
                  ["input",{"class":"quad_type","type":"hidden","value":"text"},[]],
                  ["input",{"class":"quad_template","type":"hidden","value":"[\"text\",{\"text\":\"nada\"},[]]"},[]],
                  ["div",{"class":"quad_key quad_text"},["nada"]]]]]]]]]]]]]]]]]],
  $('.quad_root')[0].toArray());

