
//
// testing quaderno
//
// Fri Sep 10 22:58:49 JST 2010
//

file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');


// warm up ;-)

assertEqual(true, true);


// basics

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


// extended attributes

assertEqual(
  ["select",{"id":"d","text":"t","title":"title","values":["a","b","c"]},[]],
  Quaderno.parse("select d \"t\" [a,b,c] \"title\""));
assertEqual(
  ["select",{"id":"d","text":"t","title":"title","values":"targets"},[]],
  Quaderno.parse("select d \"t\" [targets] \"title\""));

assertEqual(
  ["select",{"id":"d","text":"t","title":"title","values":["a","b","c"]},[]],
  Quaderno.parse("select d \"t\" [ a, b, c ] \"title\""));
assertEqual(
  ["select",{"id":"d","text":"t","title":"title","values":"targets"},[]],
  Quaderno.parse("select d \"t\" [ targets ] \"title\""));


// comments

assertEqual(
  ["text",{"text":"customer"},[]],
  Quaderno.parse("// nada \n\
    text \"customer\" \n\
  "));
assertEqual(
  ["text",{"text":"customer"},[]],
  Quaderno.parse("# nada \n\
    text \"customer\" \n\
  "));
