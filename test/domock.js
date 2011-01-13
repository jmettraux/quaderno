
//
// testing quaderno
//
// Wed Apr  7 17:29:57 JST 2010
//

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
// DOMock

var Element = function () {

  function appendChild (c) {
    if ( ! c) throw('appendChild : undefined');
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

    var parentNodes;

    // remove from previous position

    if (elt.parentNode) {
      parentNodes = elt.parentNode.childNodes;
      parentNodes.splice(parentNodes.indexOf(elt), 1);
    }

    // place in new position

    parentNodes = targetElt.parentNode.childNodes;
    
    parentNodes.splice(parentNodes.indexOf(targetElt), 0, elt);
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
      if (c.nodeType !== 1) continue;
      if (name === '*' || c.tagName === name) result.push(c);
      result = result.concat(c.getElementsByTagName(name));
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

  function toString (indentation) {

    if ( ! indentation) indentation = 1;
    var s = '';
    for (var i = 0; i < indentation; i++) s += '  ';

    s += ('<' + this.tagName + ' ');
    if (this.id) s += ('#' + this.id + ' ');
    s += attsToJson(this.attributes) + "\n";

    for (var i = 0; i < this.childNodes.length; i++) {
      var c = this.childNodes[i];
      if ((typeof c) === 'string') {
        s += (c + '\n');
      }
      else if (c === undefined) {
        s += '--- undefined ---\n';
      }
      else {
        s += c.toString(indentation + 1);
      }
    }

    //if (this.innerHTML && this.innerHTML !== '') {
    //  for (var i = 0; i < indentation + 1; i++) s += '  ';
    //  s += (this.innerHTML + "\n");
    //}

    return s;
  }

  function toArray () {
    var atts = JSON.parse(JSON.stringify(this.attributes));
    atts.id = this.id;
    var a = [ this.tagName, atts, [] ];
    for (var i = 0; i < this.childNodes.length; i++) {
      var c = this.childNodes[i];
      if ((typeof c) === 'string') a[2].push(c);
      else a[2].push(c.toArray());
    }
    return a;
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

    //_path: _path,

    toString: toString,
    toArray: toArray
  }

  o.__defineGetter__('children', function () {
    var cs = [];
    for (var i = 0; i < this.childNodes.length; i++) {
      var c = this.childNodes[i];
      //if ((typeof c) !== 'string') cs.push(c);
      if (c.nodeType === 1) cs.push(c);
    }
    return cs; });

  o.__defineGetter__('previousSibling', function () {
    if ( ! this.parentNode) return undefined;
    var cs = this.parentNode.childNodes;
    var i = cs.indexOf(this);
    return (i - 1 >= 0) ? cs[i - 1] : undefined;
  });
  o.__defineGetter__('nextSibling', function () {
    if ( ! this.parentNode) return undefined;
    var cs = this.parentNode.childNodes;
    return cs[cs.indexOf(this) + 1];
  });
  o.__defineGetter__('firstChild', function () {
    return this.childNodes[0]; });

  o.__defineGetter__('nodeName', function () {
    return this.tagName; });

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

function Text () {
  return {
    toArray: function () {
      return this.text;
    },
    toString: function () {
      return this.text + '\n';
    },
    cloneNode: function (deep) {
      var t = new Text();
      t.text = this.text;
      return t;
    },
    nodeType: 3
  }
}
function Comment () {
  return {
    toArray: function () {
      return '';
    },
    toString: function () {
      return '\n';
    },
    nodeType: 8
  };
}

function Document () {

  var root = Element();
  root.tagName = 'html';
  var body = Element();
  body.tagName = 'body';
  root.appendChild(body);

  var elements = {};

  var quad = Element();
  quad.id = 'quad';
  quad.tagName = 'div';
  quad.className = 'quad_root';
  body.appendChild(quad);
  elements['quad'] = quad;

  function createElement (tagName) {
    var e = Element();
    e.tagName = tagName;
    return e;
  }

  function createTextNode (text) {
    var t = Text();
    t.text = text;
    return t;
  }

  //function createDocumentFragment () {
  //  var e = Element();
  //  return e;
  //}

  function createComment (comment) {
    var c = Comment();
    return c;
  }

  function getElementById (id) {
    return elements[id];
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
    var all = _allElements(root);
    var r = [];
    for (var i = 0; i < all.length; i++) {
      var e = all[i];
      if (e.className.indexOf(cname) > -1) r.push(e);
        // lame check, for now
    }
    return r;
  }

  function getElementsByTagName (tname) {
    return root.getElementsByTagName(tname);
  }

  var o = {

    _testing: true,

    createElement: createElement,
    createTextNode: createTextNode,
    createComment: createComment,
    //createDocumentFragment: createDocumentFragment,
    getElementById: getElementById,
    getElementsByClass: getElementsByClass,
    getElementsByTagName: getElementsByTagName,

    nodeType: 9
  }

  o.__defineGetter__('documentElement', function () {
    return root; });

  return o;
};

document = Document();
window = { 'document': document };
navigator = { userAgent: 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; en-US; rv:1.9.2.9) Gecko/20100824 Firefox/3.6.9' };
location = 'dokodemo';

