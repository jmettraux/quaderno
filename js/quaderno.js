
var Quaderno = function () {

  //
  // misc

  function clog (o) {
    if (console) {
      if (arguments.length == 1) console.log(arguments[0]);
      else console.log(arguments);
    }
    else {
      print(o.toString());
    }
  }

  function isArray (o) {
    if (o == null) return false;
    return (o.constructor == Array);
  }

  function strip (s) {
    return s.replace(/^\s+|\s+$/g, '');
  }

  function hasClass (elt, cname) {
    if ( ! cname) return false;
    if (cname[0] == '.') cname = cname.slice(1);
    var cs = elt.className.split(' ');
    for (var i = 0; i < cs.length; i++) { if (cs[i] == cname) return true; }
    return false;
  }

  function addClass (elt, cname) {
    var cs = elt.className.split(' ');
    cs.push(cname);
    elt.className = cs.join(' ');
  }

  function removeClass (elt, cname) {
    var cs = elt.className.split(' ');
    var ncs = [];
    for (var i = 0; i < cs.length; i++) {
      var cn = cs[i];
      if (cn != cname) ncs.push(cn);
    }
    elt.className = ncs.join(' ');
  }

  function identify (path) {

    var cs = [];
    var i = null;
    var t = null;

    var s = path;

    var m;

    if (m = s.match(/^ *([^#\.]+)(.*)$/)) {
      t = m[1];
      s = m[2];
    }
    while (m = s.match(/^ *([#\.][^#\. ]+)/)) {
      var m1 = m[1];
      var ms = m1.slice(1);
      if (m1[0] == '.') cs.push(ms);
      else if (m1[0] == '#') i = ms;
      s = s.slice(m1.length);
    }

    var cn = null;
    if (cs.length > 0) cn = cs.join(' ');

    return {
      'className': cn,
      'id': i,
      'tagName': t,
      'accepts': function (elt) { return hasClass(elt, cn); }
    };
  }

  function sc (elt, path, index) {

    var i = identify(path);
    var a = [];

    for (var j = 0; j < elt.children.length; j++) {
      var c = elt.children[j];
      if (i.id && c.id == i.id) return [ c ];
      if (i.accepts(c)) a.push(c);
      else if (c.tagName && (c.tagName.toLowerCase() == i.tagName)) a.push(c);
    }

    if ( ! index) return a;
    if (index == 'first') return a[0];
    if (index == 'last') return a[a.length - 1];
    return a[index];
  }

  function spath (elt, path) {

    path = path.split(' > ');
    var start = [ elt ];
    var p;

    while (p = path.shift()) {
      start = start[0];
      var c = sc(start, p);
      if (c.length == 0) return [];
      start = c;
    }

    return start;
  }

  function create (container, tagName, attributes, innerText) {

    var e = document.createElement(tagName);

    if (attributes && ((typeof attributes) == 'string')) {
      var i = identify(attributes);
      if (i.className) e.className = i.className;
      else if (i.id) e.id = i.id;
    }
    else if (attributes) {
      for (var k in attributes) e.setAttribute(k, attributes[k]);
    }

    if (innerText) {
      //e.innerHTML = innerText; // doesn't work with Safari
      e.appendChild(document.createTextNode(innerText));
    }
    if (container) {
      container.appendChild(e);
    }

    return e;
  }

  function hide (container, classSel, value) {

    var i = create(container, 'input', classSel);
    i.setAttribute('type', 'hidden');
    i.setAttribute('value', value);
  }

  function lookup (hash, key) {
    if ( ! isArray(key)) key = key.split('.');
    if (key.length < 1) return hash;
    return lookup(hash[key.shift()], key);
  }

  function translate (options, text) {
    if (text.indexOf('.') > -1 && options.translations) {
      return lookup(options.translations, text);
    }
    return text;
  }

  //function root (elt) {
  //  if ( ! elt) return null;
  //  if (elt.undoStack) return elt;
  //  return root(elt.parentNode);
  //}
  //function stack (elt) {
  //  var r = root(elt);
  //  var d = toData(r.id);
  //  r.undoStack.push(d);
  //}

  //
  // 'tabs'

  function render_tab_label (container, template, data, options) {

    var td = create(container, 'td', {});

    if (options.mode == 'edit') {
      hide(td, '.quad_label', template[1].label);
      // TODO
      create(td, 'span', {}, template[1].label);
    }
    else {
      hide(td, '.quad_label', template[1].label);
      var a = create(td, 'a', '.quad_tab', template[1].label);
      a.setAttribute('href', '');
      a.setAttribute('onclick', 'Quaderno.showTab(this.parentNode); return false;');
    }
  }

  function render_tabs (container, template, data, options) {

    //var mode = options['mode'] || 'view';

    var tabs = template[2];

    var table = create(container, 'table', '.quad_tab_group');

    // tabs

    var tr0 = create(table, 'tr', '.quad_tab_group');

    for (var i = 0; i < tabs.length; i++) {
      render_tab_label(tr0, tabs[i], data, options);
    }

    addClass(tr0.firstChild.firstChild, 'quad_selected');

    // content

    var tr = create(table, 'tr', '.quad_tab_group');
    var td = create(tr, 'td', { 'colspan': tabs.length });
    var qtb = create(td, 'div', '.quad_tab_body');

    for (i = 0; i < tabs.length; i++) {
      var div = renderElement(qtb, tabs[i], data, options);
      tr0.children[i].tab_body = div;
      if (i != 0) div.style.display = 'none';
    }
  }

  function serialize_tabs (elt) {

    var tabs = [];
    var labels = [];

    var tds = spath(elt, 'table > tr > td');

    for (var i = 0; i < tds.length; i++) {
      labels.push(sc(tds[i], '.quad_label', 'first').value);
    }

    var trs = spath(elt, 'table > tr')[1];
    var elts = spath(trs, 'td > .quad_tab_body > .quad_element');

    for (var i = 0; i < elts.length; i++) {
      var g = serializeElement(elts[i]);
      g[1].label = labels[i];
      tabs.push(g);
    }

    return [ 'tabs', {}, tabs ];
  }

  //
  // 'group'

  function render_group (container, template, data, options) {

    var children = template[2];

    for (var i = 0; i < children.length; i++) {
      var div = create(container, 'div', {});
      renderElement(div, children[i], data, options);
    }
  }

  function serialize_group (elt) {

    return [ 'group', {}, [] ];
  }

  //
  // 'text'

  function render_text (container, template, data, options) {

    var text = template[1].label;

    if (options.mode == 'edit') {
      var label = create(container, 'span', '.quad_label', 'label');
      var input = create(container, 'input', '.quad_text', text);
    }
    else {
      text = translate(options, text);
      create(container, 'div', '.quad_text', text);
    }
  }

  //
  // 'text_input'

  function render_text_input (container, template, data, options) {

    var label = create(container, 'span', '.quad_label', template[1].label);

    var input = create(container, 'input', '.quad_text_input');
    input.setAttribute('type', 'text');
  }

  //
  // methods

  function renderElement (container, template, data, options) {

    var f;

    try {
      f = eval('render_' + template[0]);
    }
    catch (e) {
      create(
        container, 'div', {}, 'cannot render element "' + template[0] + '"');
      return;
    }

    var div = create(container, 'div', '.quad_element');
    hide(div, '.quad_type', template[0]);

    f(div, template, data, options);

    return div;
  }

  function serializeElement (container) {

    var t = sc(container, '.quad_type', 'first').value;
    var f = eval('serialize_' + t);

    return f(container);
  }

  //
  // public methods

  function showTab (td) {

    for (var i = 0; i < td.parentNode.children.length; i++) {
      removeClass(td.parentNode.children[i].firstChild, 'quad_selected');
    }
    addClass(td.firstChild, 'quad_selected');

    for (var i = 0; i < td.tab_body.parentNode.children.length; i++) {
      td.tab_body.parentNode.children[i].style.display = 'none';
    }
    td.tab_body.style.display = 'block';
  }

  function render (container, template, data, options) {

    data = data || {};

    options = options || {};
    options.mode = options.mode || 'view';

    if ((typeof container) == 'string') {
      container = document.getElementById(container);
    }

    container.mode = options.mode;

    renderElement(container, template, data, options);

    //container.undoStack = [ toTemplateWithData
  }

  function serialize (container) {

    if ((typeof container) == 'string') {
      container = document.getElementById(container);
    }

    return serializeElement(sc(container, '.quad_element', 'first'));
  }

  function extract (container) {

    var s = serialize(container);

    // TODO

    return [ "template", "data" ];
  }

  //
  // that's all folks...

  return {

    // public for the sake of testing

    identify: identify,

    // public for onClick or onChange

    showTab: showTab,

    // public

    render: render,
    serialize: serialize,
    extract: extract
  };
}();

