
//
// testing quaderno
//
// Wed Apr  7 17:29:57 JST 2010
//

//function die (message) {
//  print(message);
//  quit();
//}

//

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

function render_and_serialize (template, data, opts) {
  document._clear();
  Quaderno.render('quad', template, data, opts);
  return Quaderno.serialize('quad');
}

function render_and_produce (template, data) {
  document._clear();
  Quaderno.render('quad', template, data, { 'mode': 'use' });
  return Quaderno.produce('quad');
}

// used sometimes when debugging JSON.stringify issues
//
function to_s (o) {
  if (o === undefined) return 'undefined';
  if (o === null) return 'null';
  if (o === true) return 'true';
  if (o === false) return 'false';
  var c = o.constructor.name;
  if (c === 'Object') {
    var a = [];
    for (var k in o) { a.push(to_s(k) + ':' + to_s(o[k])) }
    return '{' + a.join(',') + '}';
  }
  if (c === 'Array') {
    var a = [];
    for (var i = 0; i < o.length; i++) { a.push(to_s(o[i])); }
    return '[' + a.join(',') + ']';
  }
  if (c === 'String') {
    return '"' + o + '"';
  }
  return o.toString();
}

function printo (o, indentation) {

  if (indentation === undefined) indentation = 0;

  if (o === undefined) { print('' + indentation + ':undefined'); return; }
  if (o === null) { print('' + indentation + ':null'); return; }
  if (o === true) { print('' + indentation + ':true'); return; }
  if (o === false) { print('' + indentation + ':false'); return; }

  var c = o.constructor.name;

  if (c === 'Object') {
    for (var k in o) {
      print('' + indentation + ':"' + k + '" =>');
      printo(o[k], indentation + 1);
    }
    return;
  }
  if (c === 'Array') {
    for (var i = 0; i < o.length; i++) {
      printo(o[i], indentation + 1);
    }
    return;
  }
  if (c === 'String') {
    print('' + indentation + ':"' + o + '"');
    return;
  }
  print('' + indentation + ':' + o.toString());
}

//
// test DOM

var Element = function () {

  function appendChild (c) {
    c.parentNode = this;
    this.childNodes.push(c);
  }
  function removeChild (c) {
    var j;
    for (var i = 0; i < this.childNodes.length; i++) {
      if (this.childNodes[i] === c) { j = i; break; }
    }
    if (j) this.childNodes.splice(j, 1);
  }

  function insertBefore (elt, targetElt) {
    var parent = targetElt.parentNode;
    parent.childNodes.splice(parent.childNodes.indexOf(targetElt), 0, elt);
  }

  function setAttribute (name, value) {
    this.attributes[name] = value;
  }
  function getAttribute (name) {
    return this.attributes[name];
  }
  function removeAttribute (name) {
    delete this.attributes[name];
  }

  function getElementsByTagName (name) {
    result = [];
    for (var i = 0; i < this.childNodes.length; i++) {
      var c = this.childNodes[i];
      if (c.tagName === name) result.push(c);
      if (c.getElementByTagName) result.concat(c.getElementByTagName(name));
    }
    return result;
  }

  function cloneNode (deep) {
    if (deep === undefined) deep = false;
    var clone = Element();
    clone.tagName = this.tagName;
    for (var k in this.attributes) {
      clone.setAttribute(k, this.attributes[k]);
    }
    for (var i = 0; i < this.childNodes.length; i++) {
      var c = this.childNodes[i];
      if (c.constructor.name === 'String' || ( ! deep))
        clone.appendChild(c);
      else
        clone.appendChild(c.cloneNode(true));
    }
    return clone;
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

  function _path (path, index) {

    if (path.constructor.name === 'String') {
      path = path.split('>');
    }

    var r = [];
    var p = path[0].replace(/^\s+|\s+$/g, '');
    path = path.slice(1);

    if ((p.match(/^\./) && this.className.indexOf(p.slice(1)) > -1) ||
        this.tagName === p) {

      if (path.length < 1) {
        r = [ this ];
      }
      else {
        for (var i = 0; i < this.childNodes.length; i++) {
          var c = this.childNodes[i];
          if ( ! c.childNodes) continue;

          var rr = c._path(path); // no index
          r = r.concat(rr);
        }
      }
    }

    if (index === -1) return r.slice(-1)[0];
    if (index !== undefined) return r[index];
    return r;
  }

  function toString (indentation) {

    if ( ! indentation) indentation = 1;
    var s = '';
    for (var i = 0; i < indentation; i++) s += '  ';

    s += ('<' + this.tagName + ' ');
    if (this.id) s += ('#' + this.id + ' ');
    s += attsToJson(this.attributes) + '\n';

    for (var i = 0; i < this.childNodes.length; i++) {
      var c = this.childNodes[i];
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

    nodeType: 1,

    attributes: { 'class': '' },
    childNodes: [],
    style: {},

    appendChild: appendChild,
    removeChild: removeChild,
    insertBefore: insertBefore,

    getAttribute: getAttribute,
    setAttribute: setAttribute,
    removeAttribute: removeAttribute,

    getElementsByTagName: getElementsByTagName,

    cloneNode: cloneNode,

    __noSuchMethod__: function (id, args) {
      print("!!! nsm : " + id);
    },

    _path: _path,

    toString: toString
  }

  o.__defineGetter__('children', function () {
    var cs = [];
    for (var i = 0; i < this.childNodes.length; i++) {
      var c = this.childNodes[i];
      if ((typeof c) !== 'string') cs.push(c);
    }
    return cs; });

  o.__defineGetter__('previousSibling', function () {
    var cs = this.parentNode.childNodes;
    var prev = null;
    for (var i = 0; i < cs.length; i++) {
      var c = cs[i];
      if (c == this) return prev;
      prev = c;
    }
    return null;
  });
  o.__defineGetter__('firstChild', function () {
    return this.childNodes[0]; });

  o.__defineGetter__('className', function () {
    return this.attributes['class']; });
  o.__defineSetter__('className', function (val) {
    this.attributes['class'] = val; });

  o.__defineSetter__('value', function (val) {
    this.attributes['value'] = val; });
  o.__defineGetter__('value', function () {
    if (this.tagName == 'select') {
      for (var i = 0; i < this.childNodes.length; i++) {
        var c = this.childNodes[i];
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

function Document () {

  var root = Element();
  var elements;

  function _clear () {
    elements = {};
    elements['quad'] = Element();
    elements['quad'].tagName = 'div';
    elements['quad'].className = 'quad_root';
    root.appendChild(elements['quad']);
  }

  _clear();

  function createElement (tagName) {
    var e = Element();
    e.tagName = tagName;
    return e;
  }

  function createTextNode (text) {
    return text;
  }

  function createComment (comment) {
    return comment;
  }

  function getElementById (id) {
    return elements[id];
  }

  function _root () {
    return root;
  }

  function _path (p, i) {
    return _root()._path(p, i);
  }

  function _allElements (elt, accumulator) {
    accumulator = accumulator || [];
    if (elt.childNodes === undefined) return accumulator;
    accumulator.push(elt);
    for (var i = 0; i < elt.childNodes.length; i++) {
      _allElements(elt.childNodes[i], accumulator);
    }
    return accumulator;
  }

  function getElementsByClass (cname) {
    var all = _allElements(_root());
    var r = [];
    for (var i = 0; i < all.length; i++) {
      var e = all[i];
      if (e.className.indexOf(cname) > -1) r.push(e);
        // lame check, for now
    }
    return r;
  }

  var o = {

    _testing: true,

    _clear: _clear,

    _root: _root,
    _path: _path,

    createElement: createElement,
    createTextNode: createTextNode,
    createComment: createComment,
    getElementById: getElementById,
    getElementsByClass: getElementsByClass
  }

  o.__defineGetter__('documentElement', function () {
    return root; });

  return o;
};

document = Document();
window = { document: document };
navigator = { userAgent: '' };
location = 'dokodemo';

load(dir + "/../js/jquery-1.4.2.js");
load(dir + "/../js/quaderno.js");

$ = window.jQuery;

