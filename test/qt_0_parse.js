
//
// testing quaderno
//
// Fri Sep 10 22:58:49 JST 2010
//

file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');

// 0

assertEqual(true, true); // warm up

// 1

var s = " \n\
tabs \n\
  tab .opinions \n\
    text .type_of_auditor \".type_of_auditor\" \n\
  tab .general \n\
";

var t = Quaderno.parse(s);

assertEqual('tabs', t[0]);
assertEqual(2, t[2].length);
assertEqual('tab', t[2][0][0]);
assertEqual('tab', t[2][1][0]);

// 2

//var s = " \n\
//tabs \n\
//  tab .opinions \n\
//    group \n\
//      text .type_of_auditor \".type_of_auditor\" \n\
//      checkbox #private \n\
//      checkbox #government \n\
//      checkbox #private_for_government \"text\" \"that title\" \n\
//    group \n\
//      text .opinions \n\
//      group repeatable \n\
//        selection #financial_product \"nada\" [ \"a\", \"b\" ] \n\
//        selection #object \n\
//  tab .general \n\
//";

