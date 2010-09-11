
//
// testing quaderno
//
// Wed Apr  7 17:29:57 JST 2010
//

load(dir + "/domock.js");
load(dir + "/../public/js/jquery-1.4.2.js");
$ = window.jQuery;

load(dir + "/../public/js/quaderno.js");

//
// assertEqual

function keys (o) {
  var keys = [];
  for (var k in o) { if (o[k] !== undefined) keys.push(k); }
  return keys.sort();
}

function diff (a, b) {

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

function assertEqual (a, b) {

  var d = diff(a, b);

  if (d === '') return;

  print("  diff :"); 
  print(d);

  aa = JSON.stringify(a);
  bb = JSON.stringify(b);

  print();
  print("  expected :");
  print(aa);
  print("  but was :");
  print(bb);

  //throw { 'name': 'AssertionError', 'message': 'assertion error' };
  throw 'AssertionError';
}

