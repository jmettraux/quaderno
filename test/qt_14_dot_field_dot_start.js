
//
// testing quaderno
//
// Fri Oct 15 11:05:37 JST 2010
//

file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');

// 0

var template = " \n\
box audit.opinions.*^ \"opinions\" \n\
  box .opinion_types.*^ \n\
    select .rating \"rating\" [misc.ratings] \n\
    text_area .rating_justification \"rating justification\" \n\
    select .audit_report \"audit report\" [annual_audit.audit_reports] \n\
";
var data = {
  "misc": {
    "ratings": [
      "Not applicable",
      "Unqualified",
      "Unqualified but emphasis on matter",
      "Qualified - limitation in scope",
      "Qualified - exception",
      "Adverse",
      "Disclaimer"
    ]
  },
  "audit": {
    "opinions": [
      {
        "opinion_types": [
          {
            "rating": "Qualified - limitation in scope",
            "audit_report": "",
            "rating_justification": ""
          }
        ],
        "financial_product": "L-I--570-",
        "object": "Financial Statement"
      },
      {
        "opinion_types": [

        ],
        "financial_product": "G-I-S-129-",
        "object": "Financial Statement"
      }
    ]
  },
  "annual_audit": {
    "audit_reports": []
  }
};

Quaderno.render('quad', template, data, {});

//print(document.documentElement);
//print(JSON.stringify(document.documentElement.toArray()));

// TODO : what with all the undefined in the first select ?

assertEqual(
  ["div",{"class":"quad_root","id":"quad"},[
    ["div",{"class":"quad_element"},[
      ["input",{"class":"quad_id","type":"hidden","value":"audit.opinions"},[]],
      ["input",{"class":"quad_type","type":"hidden","value":"_array"},[]],
      ["input",{"class":"quad_array_template","type":"hidden","value":"[\"box\",{\"_id\":\"audit.opinions.*^\",\"text\":\"opinions\"},[[\"box\",{\"_id\":\".opinion_types.*^\"},[[\"select\",{\"_id\":\".rating\",\"text\":\"rating\",\"values\":\"misc.ratings\"},[]],[\"text_area\",{\"_id\":\".rating_justification\",\"text\":\"rating justification\"},[]],[\"select\",{\"_id\":\".audit_report\",\"text\":\"audit report\",\"values\":\"annual_audit.audit_reports\"},[]]]]]]"},[]],
      ["div",{"class":"quad_element quad_box"},[
        ["input",{"class":"quad_id","type":"hidden","value":".0"},[]],
        ["input",{"class":"quad_type","type":"hidden","value":"box"},[]],
        ["span",{"class":"quad_label"},["opinions"]],
        ["div",{"class":"quad_element"},[
          ["input",{"class":"quad_id","type":"hidden","value":".opinion_types"},[]],
          ["input",{"class":"quad_type","type":"hidden","value":"_array"},[]],
          ["input",{"class":"quad_array_template","type":"hidden","value":"[\"box\",{\"_id\":\".opinion_types.*^\"},[[\"select\",{\"_id\":\".rating\",\"text\":\"rating\",\"values\":\"misc.ratings\"},[]],[\"text_area\",{\"_id\":\".rating_justification\",\"text\":\"rating justification\"},[]],[\"select\",{\"_id\":\".audit_report\",\"text\":\"audit report\",\"values\":\"annual_audit.audit_reports\"},[]]]]"},[]],
          ["div",{"class":"quad_element quad_box"},[
            ["input",{"class":"quad_id","type":"hidden","value":".0"},[]],
            ["input",{"class":"quad_type","type":"hidden","value":"box"},[]],
            ["div",{"class":"quad_element"},[
              ["input",{"class":"quad_id","type":"hidden","value":".rating"},[]],
              ["input",{"class":"quad_type","type":"hidden","value":"select"},[]],
              ["span",{"class":"quad_key"},["rating"]],
              ["select",{"class":"quad_value","onFocus":"this.previousValue = this.value;","onChange":"Quaderno.handlers.stackOnChange(this);","id":"quad:quad:audit.opinions.0.opinion_types.0.rating"},[
                ["option",{"class":"","value":"Not applicable"},["Not applicable"]],
                ["option",{"class":"","value":"Not applicable"},["undefined"]],
                ["option",{"class":"","value":"Unqualified"},["undefined"]],
                ["option",{"class":"","value":"Unqualified but emphasis on matter"},["undefined"]],
                ["option",{"class":"","value":"Qualified - limitation in scope","selected":"selected"},["undefined"]],
                ["option",{"class":"","value":"Qualified - exception"},["undefined"]],
                ["option",{"class":"","value":"Adverse"},["undefined"]],
                ["option",{"class":"","value":"Disclaimer"},["undefined"]]]]]],
            ["div",{"class":"quad_element"},[
              ["input",{"class":"quad_id","type":"hidden","value":".rating_justification"},[]],
              ["input",{"class":"quad_type","type":"hidden","value":"text_area"},[]],
              ["span",{"class":"quad_key"},["rating justification"]],
              ["textarea",{"class":"quad_value","onKeyPress":"Quaderno.handlers.stackOnKey(this);","onChange":"Quaderno.handlers.stackOnChange(this);"},[]]]],
            ["div",{"class":"quad_element"},[
              ["input",{"class":"quad_id","type":"hidden","value":".audit_report"},[]],
              ["input",{"class":"quad_type","type":"hidden","value":"select"},[]],
              ["span",{"class":"quad_key"},["audit report"]],
              ["select",{"class":"quad_value","onFocus":"this.previousValue = this.value;","onChange":"Quaderno.handlers.stackOnChange(this);","id":"quad:quad:audit.opinions.0.opinion_types.0.audit_report"},[]]]],
            ["a",{"class":"quad_minus_button array_remove_button quad_button","href":"","onClick":"Quaderno.handlers.removeFromArray(this); return false;"},[]],
            ["a",{"class":"quad_up_button array_move_button quad_button","href":"","onClick":"Quaderno.handlers.moveInArray(this, \"up\"); return false;"},[]],
            ["a",{"class":"quad_down_button array_move_button quad_button","href":"","onClick":"Quaderno.handlers.moveInArray(this, \"down\"); return false;"},[]],
            ["a",{"class":"quad_copy_button array_duplicate_button quad_button","href":"","onClick":"Quaderno.handlers.duplicateInArray(this); return false;"},[]]]],
          ["a",{"class":"quad_plus_button quad_button","href":"","onClick":"Quaderno.handlers.addToArray(this); return false;"},[]]]],
        ["a",{"class":"quad_minus_button array_remove_button quad_button","href":"","onClick":"Quaderno.handlers.removeFromArray(this); return false;"},[]],
        ["a",{"class":"quad_up_button array_move_button quad_button","href":"","onClick":"Quaderno.handlers.moveInArray(this, \"up\"); return false;"},[]],
        ["a",{"class":"quad_down_button array_move_button quad_button","href":"","onClick":"Quaderno.handlers.moveInArray(this, \"down\"); return false;"},[]],
        ["a",{"class":"quad_copy_button array_duplicate_button quad_button","href":"","onClick":"Quaderno.handlers.duplicateInArray(this); return false;"},[]]]],
      ["div",{"class":"quad_element quad_box"},[
        ["input",{"class":"quad_id","type":"hidden","value":".0"},[]],
        ["input",{"class":"quad_type","type":"hidden","value":"box"},[]],
        ["span",{"class":"quad_label"},["opinions"]],
        ["div",{"class":"quad_element"},[
          ["input",{"class":"quad_id","type":"hidden","value":".opinion_types"},[]],
          ["input",{"class":"quad_type","type":"hidden","value":"_array"},[]],
          ["input",{"class":"quad_array_template","type":"hidden","value":"[\"box\",{\"_id\":\".opinion_types.*^\"},[[\"select\",{\"_id\":\".rating\",\"text\":\"rating\",\"values\":\"misc.ratings\"},[]],[\"text_area\",{\"_id\":\".rating_justification\",\"text\":\"rating justification\"},[]],[\"select\",{\"_id\":\".audit_report\",\"text\":\"audit report\",\"values\":\"annual_audit.audit_reports\"},[]]]]"},[]],
          ["a",{"class":"quad_plus_button quad_button","href":"","onClick":"Quaderno.handlers.addToArray(this); return false;"},[]]]],
        ["a",{"class":"quad_minus_button array_remove_button quad_button","href":"","onClick":"Quaderno.handlers.removeFromArray(this); return false;"},[]],
        ["a",{"class":"quad_up_button array_move_button quad_button","href":"","onClick":"Quaderno.handlers.moveInArray(this, \"up\"); return false;"},[]],
        ["a",{"class":"quad_down_button array_move_button quad_button","href":"","onClick":"Quaderno.handlers.moveInArray(this, \"down\"); return false;"},[]],
        ["a",{"class":"quad_copy_button array_duplicate_button quad_button","href":"","onClick":"Quaderno.handlers.duplicateInArray(this); return false;"},[]]]],
      ["a",{"class":"quad_plus_button quad_button","href":"","onClick":"Quaderno.handlers.addToArray(this); return false;"},[]]]]]],
  $('.quad_root')[0].toArray());

