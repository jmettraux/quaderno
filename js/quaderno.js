// 
// Copyright (c) 2010, John Mettraux, jmettraux@gmail.com
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//

var Quaderno = function () {

  //
  // misc

  function clog (o) {
    try {
      if (arguments.length == 1) console.log(arguments[0]);
      else console.log(arguments);
    }
    catch (e) {
      if (o == undefined) print("undefined");
      else print(o.toString());
    }
  }

  function isArray (o) {
    if (o == null) return false;
    return (o.constructor == Array);
  }

  function dup (o) {
    if (isArray(o)) {
      var r = [];
      for (var i = 0; i < o.length; i++) r.push(o[i]);
      return r;
    }
    return o;
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
    if (cname.match(/^\./)) cname = cname.slice(1);
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

    if (index === -1) return a.slice(-1)[0];
    return (index !== undefined) ? a[index] : a;
  }

  function scc (elt, cname) {

    var child = sc(elt, cname, 0);
    if (child) return child;

    var div = sc(elt, 'div', 0);
    if ( ! div) return undefined;
    if (hasClass(div, '.quad_element')) return undefined;

    return sc(div, cname, 0);
  }

  function spath (elt, path, index) {

    path = path.split(' > ');
    var start = [ elt ];
    var p;

    while (p = path.shift()) {
      start = start[0];
      var c = sc(start, p);
      if (c.length == 0) return [];
      start = c;
    }

    if (index === -1) return start.slice(-1)[0];
    return (index !== undefined) ? start[index] : start;
  }

  function sparent (elt, s) {

    if ( ! elt) return undefined;
    if (s.constructor.name === 'String') s = identify(s);

    if (s.id && elt.id === s.id) return elt;
    if (s.accepts(elt)) return elt;
    if (elt.tagName && (elt.tagName.toLowerCase() === s.tagName)) return elt;

    return sparent(elt.parentNode, s);
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

    if (hash == undefined) return undefined

    if ( ! isArray(key)) key = key.split('.');
    if (key.length < 1) return hash;

    return lookup(hash[key.shift()], key);
  }

  function getId (template) {
    var id = template[1].id;
    if (id.match(/\.$/)) return id.slice(0, -1);
    return id;
  }

  function translate (options, text) {
    if (text.indexOf('.') > -1 && options.translations) {
      return lookup(options.translations, text);
    }
    return text;
  }

  function getValue (template, data, options) {
    var v = options.value;
    if (v !== undefined) {
      delete options.value;
      return v;
    }
    if (template[1].value) return template[1].value;
    if (template[1].id) return lookup(data, template[1].id);
    return undefined;
  }

  function button (container, className, onclick, title) {

    if ( ! onclick.match(/return false;$/)) onclick += " return false;";
    if (className[0] == '.') className = className.slice(1, className.length);

    title = title || {
      'quad_plus_button': 'add',
      'quad_minus_button': 'remove',
      'quad_up_button': 'move up',
      'quad_down_button': 'move down',
      'quad_copy_button': 'copy',
      'quad_cut_button': 'cut',
      'quad_paste_button': 'paste',
      'quad_go_button': 'go',
      'quad_left_button': 'left',
      'quad_right_button': 'right'
    }[className];

    return create(
      container,
      'a',
      { 'href': '',
        'class': className + ' quad_button',
        'title': title,
        'onclick': onclick });
  }

  function createTextInput (container, key, template, data, options) {

    create(container, 'span', '.quad_key_e', key);

    var input = create(container, 'input', '.quad_' + key);
    input.type = 'text';

    var v = template[1][key];
    if (v) input.value = v;

    input.setAttribute('onchange', 'Quaderno.stack(this);');

    return input;
  }

  function fetchAndSet (elt, key, atts) {

    var v = scc(elt, '.quad_' + key);
    if ( ! v) return;

    v = v.value;
    if (v === '') return;

    atts[key] = v;
  }

  function computeSiblingOffset (elt, count) {
    count = count || 0;
    if ( ! elt.previousSibling) return count;
    return computeSiblingOffset(elt.previousSibling, count + 1);
  }

  function setParent (template, parent) {
    template.parent = parent;
    for (var i = 0; i < template[2].length; i++) {
      setParent(template[2][i], template);
    }
  }

  function lookupFunction (funcPrefix, template) {

    var type = template;
    if (isArray(template)) type = template[0];

    try { return eval(funcPrefix + type); }
    catch (e) { return eval(funcPrefix); }
  }

  function findTab (elt) {

    var quadElement = sparent(elt, '.quad_element');
    var index = computeSiblingOffset(quadElement);
    var table = quadElement.parentNode.parentNode.parentNode.parentNode;
    var td = spath(table, 'tr > td', index);

    return td;
  }

  function findTabBody (elt) {

    var td = sparent(elt, 'td');
    var index = computeSiblingOffset(td);
    var table = sparent(elt, 'table');
    var tr = sc(table, 'tr', 1);

    return spath(tr, 'td > .quad_tab_body > .quad_element', index);
  }

  //
  // root, stack, undo

  function root (elt) {

    if ( ! elt) return null;
    if (elt.undoStack) return elt;
    return root(elt.parentNode);
  }

  function stack (elt) {

    var r = root(elt);
    r.undoStack.push(serialize(r));
  }

  function undo (containerId) {

    var container = document.getElementById(containerId);
    var stack = container.undoStack;
    var template = stack.pop();

    render(container, template, container.data, { 'mode': container.mode });

    if (stack.length < 1) stack.push(template);

    container.undoStack = stack;
  }

  var TYPE_BLANKS = {
    'text_input': [ 'text_input', {}, [] ],
    'text': [ 'text', {}, [] ],
    'group': [ 'group', {}, [] ]
  }

  //var TYPES = []; for (var k in TYPE_BLANKS) { TYPES.push(k); }
  var TYPES = [
    'text_input', 'text', 'group'
  ];

  //
  // 'tabs'

  function use_tab_label (container, template, data, options) {

    var td = create(container, 'td', {});

    hide(td, '.quad_label', template[1].label);
    var a = create(td, 'a', '.quad_tab', template[1].label);
    a.setAttribute('href', '');
    a.setAttribute('onclick', 'Quaderno.showTab(this.parentNode); return false;');
  }

  function edit_tab_label (container, template, data, options) {

    if (template === 'new_tab_tab') {

      var td = create(container, 'td', '.new_tab_tab');
      var div = create(td, 'div', '.quad_tab');

      button(
        div, '.quad_plus_button', 'Quaderno.addTab(this);', 'add a new tab');
    }
    else {

      use_tab_label(container, template, data, options);
    }
  }

  function use_tabs (container, template, data, options) {

    var tabs = dup(template[2]);
    if (options.mode === 'edit') tabs.push('new_tab_tab');

    var table = create(container, 'table', '.quad_tab_group');

    // tabs

    var tr0 = create(table, 'tr', '.quad_tab_group');

    for (var i = 0; i < tabs.length; i++) {
      var f = (options.mode === 'edit') ? edit_tab_label : use_tab_label;
      f(tr0, tabs[i], data, options);
    }

    var tab = spath(tr0, 'td > .quad_tab', 0);
    addClass(tab, 'quad_selected');

    // content

    var tr = create(table, 'tr', '.quad_tab_group');
    var td = create(tr, 'td', { 'colspan': tabs.length });
    var qtb = create(td, 'div', '.quad_tab_body');

    for (i = 0; i < template[2].length; i++) {
      var div = renderElement(qtb, tabs[i], data, options);
      //tr0.children[i].tab_body = div;
      if (i != 0) div.style.display = 'none';
    }

    return table;
  }

  var edit_tabs = use_tabs;

  function serialize_tabs (elt) {

    var tabs = [];
    var labels = [];

    var tds = spath(elt, 'table > tr > td');
    for (var i = 0; i < tds.length; i++) {
      var lab =
        sc(tds[i], '.quad_label', 0) ||
        spath(tds[i], '.quad_tab > .quad_label', 0);
      if (lab) labels.push(lab.value);
    }

    var trs = spath(elt, 'table > tr', 1);
    var tab_body = spath(trs, 'td > .quad_tab_body', 0);

    var children = serialize_children(tab_body);
    for (var i = 0; i < children.length; i++) {
      children[i][1].label = labels[i];
    }

    return [ 'tabs', {}, children ];
  }

  //
  // 'group'

  function use_group (container, template, data, options) {

    if ( ! hasClass(container.parentNode, 'quad_tab_body')) {
      addClass(container, '.quad_group');
    }

    var children = template[2];
    var values = [ undefined ];

    if (template[1].id && template[1].id.match(/\.$/)) {
      values = lookup(data, getId(template));
    }

    for (var j = 0; j < values.length; j++) {

      options.value = values[j]

      for (var i = 0; i < children.length; i++) {
        renderElement(container, children[i], data, options);
      }
    }
  }

  function addMoveButtons (elt) {

    button(
      elt,
      '.quad_minus_button',
      'Quaderno.removeElement(this.parentNode.parentNode);');
    button(
      elt,
      '.quad_up_button',
      'Quaderno.moveElement(this.parentNode.parentNode, "up");');
    button(
      elt,
      '.quad_down_button',
      'Quaderno.moveElement(this.parentNode.parentNode, "down");');
  }

  function edit_group (container, template, data, options) {

    if ( ! hasClass(container.parentNode, 'quad_tab_body')) {
      addClass(container, '.quad_group');
    }

    options.novalue = true;
    var gdiv = edit_(container, template, data, options);
    addClass(gdiv, '.quad_group_head');

    if (hasClass(container.parentNode, 'quad_tab_body')) {

      var label = sc(gdiv, '.quad_label', 0);
      label.setAttribute('onchange', 'Quaderno.tabLabelChanged(this);');

      button(
        gdiv, '.quad_left_button', 'Quaderno.moveTab(this, "left");',
        'move this tab one step left');
      button(
        gdiv, '.quad_right_button', 'Quaderno.moveTab(this, "right");',
        'move this tab one step right');
      button(
        gdiv, '.quad_minus_button', 'Quaderno.removeTab(this);',
        'remove this tab');
    }

    var children = template[2];

    for (var i = 0; i < children.length; i++) {
      var c = editElement(container, children[i], data, options);
      var cdiv = sc(c, 'div', 0);
      addMoveButtons(cdiv);
    }

    var div = create(container, 'div', {});

    var sel = create(div, 'select', '.quad_type');
    for (var i = 0; i < TYPES.length; i++) {
      var o = create(sel, 'option', {}, TYPES[i]);
      if (TYPES[i] === template[0]) o.setAttribute('selected', 'selected');
    }
    button(div, '.quad_plus_button', 'Quaderno.addElement(this.parentNode);');

    return container;
  }

  //
  // 'text'

  function use_text (container, template, data, options) {

    var text = template[1].label;

    hide(container, '.quad_label', text);
    text = translate(options, text);
    create(container, 'div', '.quad_key.quad_text', text);
  }

  //
  // 'text_input'

  function use_text_input (container, template, data, options) {

    hide(container, '.quad_label', template[1].label);
    create(container, 'span', '.quad_key', template[1].label);

    var input = create(container, 'input', '.quad_value');
    input.setAttribute('type', 'text');

    var value = getValue(template, data, options);
    //var value = options.value;
    //delete options.value;
    if (value != undefined) input.value = value;
  }

  //
  // *

  function edit_ (container, template, data, options) {

    var div = create(container, 'div', {});

    var novalue = options.novalue;

    create(div, 'span', '.quad_type', template[0]);
    createTextInput(div, 'id', template, data, options);
    createTextInput(div, 'label', template, data, options);
    createTextInput(div, 'title', template, data, options);
    if ( ! novalue) createTextInput(div, 'value', template, data, options);

    delete options.novalue;

    return div;
  }

  function serialize_children (elt) {

    var children = [];
    var elts = sc(elt, '.quad_element');

    for (var i = 0; i < elts.length; i++) {
      children.push(serializeElement(elts[i]));
    }

    return children;
  }

  function serialize_ (elt, serializeChildren) {

    if (serializeChildren == undefined) serializeChildren = true;

    var type = sc(elt, '.quad_type', 0).value;

    var atts = {};

    var id = fetchAndSet(elt, 'id', atts);
    var label = fetchAndSet(elt, 'label', atts);
    var title = fetchAndSet(elt, 'title', atts);
    var value = fetchAndSet(elt, 'value', atts);
    var values = fetchAndSet(elt, 'values', atts);

    var children = [];
    if (serializeChildren) children = serialize_children(elt);

    return [ type, atts, children ];
  }

  //
  // methods

  function editElement (container, template, data, options) {

    var div = create(container, 'div', '.quad_element');

    hide(div, '.quad_type', template[0]);

    var f = lookupFunction('edit_', template);
    f(div, template, data, options);

    return div;
  }

  function useElement (container, template, data, options) {

    var f = lookupFunction('use_', template);

    var div = create(container, 'div', '.quad_element');

    var id = template[1].id;

    if (id) {
      hide(div, '.quad_id', id);
    }
    if (template[1].title) {
      hide(div, '.quad_title', template[1].title);
      div.setAttribute('title', translate(options, template[1].title));
    }

    hide(div, '.quad_type', template[0]);

    f(div, template, data, options);

    return div;
  }

  var viewElement = useElement;

  function renderElement (container, template, data, options) {

    if (options.mode === 'view')
      return viewElement(container, template, data, options);
    if (options.mode === 'use')
      return useElement(container, template, data, options);
    //else // 'edit'
    return editElement(container, template, data, options);
  }

  function serializeElement (container) {

    var type = sc(container, '.quad_type', 0).value;
    var f = lookupFunction('serialize_', type);

    return f(container);
  }

  //
  // onClick public methods

  function showTab (td) {

    for (var i = 0; i < td.parentNode.children.length; i++) {
      var tab = sc(td.parentNode.children[i], '.quad_tab', 0);
      removeClass(tab, 'quad_selected');
    }
    var tab = sc(td, '.quad_tab', 0);
    addClass(tab, 'quad_selected');

    var tab_body = findTabBody(tab);

    for (var i = 0; i < tab_body.parentNode.children.length; i++) {
      tab_body.parentNode.children[i].style.display = 'none';
    }
    tab_body.style.display = 'block';
  }

  function removeTab (elt) {

    stack(elt);

    var quadElement = sparent(elt, '.quad_element');
    var td = findTab(elt);

    var next = td.nextSibling || td.previousSibling;

    if (hasClass(next, '.new_tab_tab')) return; // can't remove last tab

    quadElement.parentNode.removeChild(quadElement);
    td.parentNode.removeChild(td);

    showTab(next);
  }

  function moveTab (elt, direction) {

    stack(elt);

    var qe = sparent(elt, '.quad_element');
    var td = findTab(elt);

    if (direction === 'left') {
      if ( ! td.previousSibling) return;
      td.parentNode.insertBefore(td, td.previousSibling);
      qe.parentNode.insertBefore(qe, qe.previousSibling);
    }
    else {
      if (hasClass(td.nextSibling, '.new_tab_tab')) return;
      td.parentNode.insertBefore(td.nextSibling, td);
      qe.parentNode.insertBefore(qe.nextSibling, qe);
    }
  }

  function addElement (elt) {

    stack(elt);

    var type = sc(elt, '.quad_type', 0).value;
    var blank = TYPE_BLANKS[type];

    var newElement = editElement(elt.parentNode, blank, {}, {});
    addMoveButtons(sc(newElement, 'div', 0));

    elt.parentNode.insertBefore(newElement, elt);
  }

  function moveElement (elt, direction) {

    stack(elt);

    if (direction === 'up') {
      if (elt.previousSibling && ( ! hasClass(elt.previousSibling, 'quad_group_head')))
        elt.parentNode.insertBefore(elt, elt.previousSibling);
    }
    else {
      if (elt.nextSibling && hasClass(elt.nextSibling, 'quad_element'))
        elt.parentNode.insertBefore(elt.nextSibling, elt);
    }
  }

  function removeElement (elt) {

    stack(elt);

    elt.parentNode.removeChild(elt);
  }

  function tabLabelChanged (elt) {

    var newLabel = strip(elt.value);
    elt.value = newLabel;

    var quad_element = elt.parentNode.parentNode;
    var i = computeSiblingOffset(quad_element);
    var table = quad_element.parentNode.parentNode.parentNode.parentNode;
    var td = spath(table, 'tr > td', i);
    var input = sc(td, 'input', 0);
    var a = sc(td, 'a', 0);

    input.value = newLabel;
    a.innerHTML = newLabel;
  }

  //
  // public methods

  function render (container, template, data, options) {

    setParent(template);

    data = data || {};

    options = options || {};
    options.mode = options.mode || 'view';

    if ((typeof container) == 'string') {
      container = document.getElementById(container);
    }

    var fc; while (fc = container.firstChild) { container.removeChild(fc); }

    container.mode = options.mode;

    renderElement(container, template, data, options);

    container.data = data;
    container.undoStack = [ template ];
  }

  function serialize (container) {

    if ((typeof container) == 'string') {
      container = document.getElementById(container);
    }

    return serializeElement(sc(container, '.quad_element', 0));
  }

  //
  // that's all folks...

  return {

    // public for the sake of testing

    identify: identify,

    // public for onClick or onChange

    showTab: showTab,
    removeTab: removeTab,
    moveTab: moveTab,
    addElement: addElement,
    moveElement: moveElement,
    removeElement: removeElement,
    tabLabelChanged: tabLabelChanged,
    stack: stack,

    // public

    render: render,
    serialize: serialize,
    undo: undo
  };
}();

