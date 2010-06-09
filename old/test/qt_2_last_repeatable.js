
file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + "/base.js");


function o (checklist) {
  Quaderno.render('quad', checklist, 'edit');
  //print(document.getElementById('quad').toString());
  //print(document.getElementById('quad').mode);
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
          "title": "where ?",
          "repeatable": true }
      ]
    }
  ]
};

assertEqual(cl, o(cl));

