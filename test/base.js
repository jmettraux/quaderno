
//
// testing quaderno
//
// Wed Apr  7 17:29:57 JST 2010
//

load(dir + "/domock.js");
load(dir + "/../public/js/jquery-1.4.2.js");
$ = window.jQuery;

load(dir + "/../public/js/quaderno.js");


function prettyAst(tree, indentation) {

  var s = '';

  indentation = indentation || 0;
  for (var i = 0; i < indentation; i++) s = s + '  ';

  var cs = "[\n";
  var children = tree[2];
  if (children.length === 0) {
    cs = "[]";
  }
  else if (children.length === 1 && ((typeof children[0]) === 'string')) {
    cs = "[" + JSON.stringify(children[0]) + "]";
  }

  s = s + "[\"" + tree[0] + "\",";
  s = s + (JSON.stringify(tree[1]) + ",");
  s = s + cs;

  if (cs === "[\n") {
    for (var i = 0; i < children.length; i++) {
      s = s + prettyAst(children[i], indentation + 1);
      if (i < children.length - 1) s = s + ",\n";
    }
    s = s + "]";
  }

  s = s + "]";

  return s;
}

function isArray(o) {
  return (o.constructor.toString().match(/^function Array/) != undefined);
}

function stringify(o) {
  if (isArray(o) &&
    o.length === 3 &&
    ((typeof o[0]) === 'string') &&
    ((typeof o[1]) === 'object') &&
    isArray(o[2])
  ) {
    return prettyAst(o);
  }
  return JSON.stringify(o);
}

//
// assertEqual

function keys(o) {

  var keys = [];
  for (var k in o) { if (o[k] !== undefined) keys.push(k); }

  return keys.sort();
}

function diff(a, b) {

  var ta = (typeof a);
  var tb = (typeof b);

  var ja = JSON.stringify(a);
  //print("===============");
  //printo(b);
  var jb = JSON.stringify(b);

  if (ta !== tb) { return ja + '\n  !=\n' + jb + '\n  type mismatch'; }

  if (a instanceof Array) {
    if (a.length != b.length) {
      return ja + '\n  !=\n' + jb + '\n  not the same length';
    }
    for (var i = 0; i < a.length; i++) {
      var va = a[i];
      var vb = b[i];
      r = diff(va, vb); if (r.length > 0) return r;
    }
  }
  else if (a instanceof Object) {
    var ka = keys(a);
    var kb = keys(b);
    var r = diff(ka, kb);
    if (r.length > 0) {
      return ja + '\n  !=\n' + jb + '\n  keys mismatch\n' + r;
    }
    for (var k in a) {
      var va = a[k];
      var vb = b[k];
      r = diff(va, vb);
      if (r.length > 0) {
        return ja + '\n  !=\n' + jb + '\n  values mismatch\n' + r;
      }
    }
  }
  else {
    if (ja !== jb) { return ja + ' !== ' + jb; }
  }

  return '';
}

function assertEqual(a, b) {

  var d = diff(a, b);

  if (d === '') return;

  print("  diff :"); 
  print(d);

  aa = stringify(a);
  bb = stringify(b);

  print();
  print("  - - - expected :");
  print(aa);
  print("  - - - but was :");
  print(bb);

  //throw { 'name': 'AssertionError', 'message': 'assertion error' };
  throw 'AssertionError';
}

