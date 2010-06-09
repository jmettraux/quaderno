
//
// testing quaderno
//
// Wed Apr  7 17:29:57 JST 2010
//

//function die (message) {
//  print(message);
//  quit();
//}

load(dir + "/../js/quaderno.js");

//function pp (o, ind) {
//  if ( ! ind) ind = 1;
//  var s = '';
//  for (var i = 0; i < ind; i++) s += '  ';
//  if (o instanceof Array) {
//    s += '[\n';
//    for (var j = 0; j < o.length; j++) {
//      s += pp(o[j], ind + 1);
//      s += ',\n';
//    }
//    for (var i = 0; i < ind; i++) s += '  ';
//    s += ']';
//  }
//  else if (o instanceof Object) {
//    s += '{\n';
//    for (var k in o) {
//      for (var i = 0; i < ind + 1; i++) s += '  ';
//      s += k;
//      s += ':\n';
//      s += pp(o[k], ind + 1);
//      s += ',\n';
//    }
//    for (var i = 0; i < ind; i++) s += '  ';
//    s += '}';
//  }
//  else {
//    s += JSON.stringify(o);
//  }
//  return s;
//}

function toJson (o) {
  return JSON.stringify(o);
}

function keys (o) {
  var keys = []; for (var k in o) keys.push(k); return keys.sort();
}

function diff (a, b) {

  var ta = (typeof a);
  var tb = (typeof b);

  var ja = (toJson(a));
  var jb = (toJson(b));

  if (ta != tb) { return ja + '\n  !=\n' + jb + '\n  type mismatch'; }

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
    if (ja != jb) { return ja + ' != ' + jb; }
  }

  return '';
}

function assertEqual (a, b) {

  var d = diff(a, b);

  if (d == '') return;

  print("  diff :"); 
  print(d);

  aa = toJson(a);
  bb = toJson(b);

  print();
  print("  expected :");
  print(aa);
  print("  but was :");
  print(bb);
}

var Element = function () {

  function appendChild (c) {
    c.parentNode = this;
    this.children.push(c);
  }
  function setAttribute (name, value) {
    this.attributes[name] = value;
  }
  function removeAttribute (name) {
    delete this.attributes[name];
  }

  function attsToJson (atts) {
    var h = {};
    for (var k in atts) { h[k] = atts[k]; }
    var kl = h['class'];
    delete(h['class']);
    var s = '';
    if (kl) {
      s += ('.' + kl.split(' ').join('.') + ' ');
    }
    s += JSON.stringify(h).slice(1, -1);
    return s;
  }

  function toString (indentation) {

    if ( ! indentation) indentation = 1;
    var s = '';
    for (var i = 0; i < indentation; i++) s += '  ';

    s += ('<' + this.tagName + ' ');
    if (this.id) s += ('#' + this.id + ' ');
    s += attsToJson(this.attributes) + '\n';

    for (var i = 0; i < this.children.length; i++) {
      var c = this.children[i];
      s += c.toString(indentation + 1);
    }

    if (this.innerHTML != undefined && this.innerHTML != '') {
      for (var i = 0; i < indentation + 1; i++) s += '  ';
      s += this.innerHTML;
      s += '\n';
    }

    return s;
  }

  var o = {

    attributes: { 'class': '' },
    children: [],
    style: {},

    appendChild: appendChild,
    setAttribute: setAttribute,
    removeAttribute: removeAttribute,

    __noSuchMethod__: function (id, args) {
      print("!!! nsm : " + id);
    },

    toString: toString
  }

  o.__defineGetter__('previousSibling', function () {
    var cs = this.parentNode.children;
    var prev = null;
    for (var i = 0; i < cs.length; i++) {
      var c = cs[i];
      if (c == this) return prev;
      prev = c;
    }
    return null;
  });
  o.__defineGetter__('firstChild', function () {
    return this.children[0]; });

  o.__defineGetter__('className', function () {
    return this.attributes['class']; });
  o.__defineSetter__('className', function (val) {
    this.attributes['class'] = val; });

  o.__defineSetter__('value', function (val) {
    this.attributes['value'] = val; });
  o.__defineGetter__('value', function () {
    if (this.tagName == 'select') {
      for (var i = 0; i < this.children.length; i++) {
        var c = this.children[i];
        if (c.attributes['selected']) return c.innerHTML;
      }
    }
    return this.attributes['value']; });

  o.__defineGetter__('title', function () {
    return this.attributes['title']; });

  o.__defineGetter__('checked', function () {
    return this.attributes['checked'] == 'checked'; });

  //o.__defineGetter__('style', function () { return this.attributes.style; });

  return o;
};

document = function () {

  var elements = {};
  elements['quad'] = Element();
  elements['quad'].tagName = 'div';

  function createElement (tagName) {
    var e = Element();
    e.tagName = tagName;
    return e;
  }

  function getElementById (id) {
    return elements[id];
  }

  return {

    _testing: true,

    createElement: createElement,
    getElementById: getElementById,
  }
}();

