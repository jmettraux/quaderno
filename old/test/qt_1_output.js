
file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + "/base.js");


function o (checklist) {
  Quaderno.render('quad', checklist);
  //print(document.getElementById('quad').toString());
  return Quaderno.toData('quad');
}

var cl = {
  "type": "tab_group",
  "elements": [
    { "label": "tab a",
      "type": "group",
      "elements": [
        { "label": "red",
          "type": "boolean",
          "value": true,
          "title": "is it red ?" },
        { "label": "birthday",
          "type": "date",
          "value": "1948/10/03",
          "title": "enter birth date..." },
        { "label": "age",
          "type": "text",
          "value": "35 yo",
          "title": "enter the age",
          "repeatable": true },
        { "label": "country",
          "type": "select",
          "value": "vatican",
          "values": [ "italy", "switzerland", "vatican", "japan", "usa" ],
          "title": "where ?" }
      ]
    },
    //{ "label": "tab b",
    //  "type": "group",
    //  "elements": [
    //    { "label": "car",
    //      "type": "text",
    //      "value": "BMW",
    //      "title": "which car ?" },
    //    { "type": "group",
    //      "label": "address",
    //      "elements": [
    //        { "type": "text", "label": "city", "value": "x" },
    //        { "type": "text", "label": "zip", "value": "y" }
    //      ]
    //    }
    //  ]
    //},
    //{ "label": "tab c",
    //  "type": "group",
    //  "elements": [
    //    { "label": "email",
    //      "type": "text",
    //      "value": "quaderno@example.com",
    //      "title": "fill in email address here" }
    //  ]
    //}
  ]
};

assertEqual(cl, o(cl));

