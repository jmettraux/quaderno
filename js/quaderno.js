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


// TODO : prevent html/js injection !
// depends on the excellent jquery-1.4.2


var Quaderno = function () {

  //
  // misc

  function clog (o) {
    try {
      if (arguments.length == 1) console.log(arguments[0]);
      else console.log(arguments);
    }
    catch (e) {
      if (arguments.length == 1) print(JSON.stringify(arguments[0]));
      else print(JSON.stringify(arguments));
    }
  }

  function toString (elt, indent) {
    if (indent == undefined) indent = 0;
    s = ''
    for (var i = 0; i < indent; i++) s += '  ';
    s += ('<' + elt.tagName + ' ');
    s += ('.' + elt.className + ' ');
    s += "\n";
    for (var i = 0; i < elt.children.length; i++) {
      s += toString(elt.children[i], indent + 1);
    }
    return s;
  }

  function isComposite (o) {
    if ( ! o) return false;
    var cn = o.constructor.name;
    return cn === 'Object' || cn === 'Array';
  }

  // shallow copy
  //
  function dup (o) {
    if ($.isArray(o)) {
      var r = [];
      for (var i = 0; i < o.length; i++) r.push(o[i]);
      return r;
    }
    if (o && o.constructor === Object) {
      var r = {};
      for (var k in o) { r[k] = o[k] };
      return r;
    }
    return o;
  }

  function merge (o, h) {
    var r = {};
    for (var k in o) { r[k] = o[k]; }
    for (var k in h) { r[k] = h[k]; }
    return r;
  }

  function hasClass (elt, cname) {
    if ( ! cname) return false;
    if (cname[0] === '.') cname = cname.slice(1);
    return $(elt).hasClass(cname);
  }

  function addClass (elt, cname) {
    if (cname[0] === '.') cname = cname.slice(1);
    $(elt).addClass(cname);
  }

  function removeClass (elt, cname) {
    if (cname[0] === '.') cname = cname.slice(1);
    $(elt).removeClass(cname);
  }

  function children (elt, cname) {
    var r = [];
    for (var i = 0; i < elt.childNodes.length; i++) {
      var c = elt.childNodes[i];
      if (c.nodeType !== 1) continue;
      if (hasClass(c, cname)) r.push(c);
    }
    return r;
  }

  function child (elt, cname) {
    return children(elt, cname)[0];
  }

  function find3 (elt, cname, depth) {
    if (depth === undefined) depth = 0;
    if (elt.nodeType !== 1) return undefined;
    if (depth > 0 && hasClass(elt, '.quad_element')) return undefined;
    if (hasClass(elt, cname)) return elt;
    for (var i = 0; i < elt.childNodes.length; i++) {
      var r = find3(elt.childNodes[i], cname, depth + 1);
      if (r) return r;
    }
    return undefined;
  }

  function create (container, tagName, attributes, innerText) {

    var atts = attributes || {};

    if (attributes && ((typeof attributes) === 'string')) {
      attributes = $.trim(attributes.split('.').join(' '));
      atts = { 'class': attributes };
    }

    var e = $('<' + tagName + '/>', atts);

    if (innerText) {
      //e.innerHTML = innerText; // doesn't work with Safari
      e[0].appendChild(document.createTextNode(innerText));
    }
    if (container) {
      container.appendChild(e[0]);
    }

    return e[0];
  }

  function setAttribute (e, key, value) {
    try {
      e.setAttribute(key, value);
    }
    catch (e) { // IE...
      e[key] = value;
    }
  }

  function hide (container, classSel, value) {

    if (classSel[0] == '.') classSel = classSel.slice(1);

    return create(
      container,
      'input',
      { 'class': classSel, 'type': 'hidden', 'value': value });
  }

  function lookup (hash, key) {

    if (hash === undefined) return undefined;
    if (key === undefined) return undefined;

    if ( ! $.isArray(key)) key = key.split('.');
    if (key.length < 1) return hash;

    // TODO : when key is an array index

    return lookup(hash[key.shift()], key);
  }

  function translate (options, text) {

    if ( ! text) return text;

    if (text.indexOf('.') > -1 && options.translations) {
      return lookup(options.translations, text);
    }

    return text;
  }

  function isPropertyId (id) {
    return (id && id.match(/^\./));
  }

  //function isArrayId (id) {
  //  return (id && id.match(/\.[\*\+-]?\^?$/));
  //}
  function splitArrayMarker (id) {

    if ( ! id) return undefined;

    var m = id.match(/(.+)(\.[\*\+-]?\^?)$/);

    if ( ! m) return undefined;

    return {
      'id': m[1],
      'canAdd': m[2].match(/\+/) || m[2].match(/\*/),
      'canRemove': m[2].match(/\-/) || m[2].match(/\*/),
      'canReorder': m[2].match(/\^/)
    };
  }

  function getValue (template, data, options) {

    if (template[0] !== 'checkbox' &&
      template[0] !== 'select' &&
      template[1].value !== undefined) {

      // since 'false' is an OK value

      return template[1].value;
    }

    return lookup(data, options.id || template[1].id);
  }

  function getValues (template, data, options) {

    var values = template[1].values;

    if (values === undefined) return [];

    if (values.indexOf(',') < 0) {
      values = lookup(data, values);
    }

    if (values === undefined) return [];

    if ($.isArray(values)) return values;

    return values.toString().split(',');
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

    setAttribute(input, 'onchange', 'Quaderno.stack(this);');

    return input;
  }

  function fetchAndSet (elt, key, atts, type) {

    //var v = $(elt).find('.quad_' + key)[0];
    var v = find3(elt, '.quad_' + key);
    if ( ! v) return;

    v = v.value;
    //v = $(v).val();

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
    if ($.isArray(template)) type = template[0];

    try { return eval(funcPrefix + type); }
    catch (e) { return eval(funcPrefix); }
  }

  function toElement (id_or_element) {

    if ((typeof id_or_element) == 'string') {
      return document.getElementById(id_or_element);
    }
    return id_or_element;
  }

  function findTab (elt) {

    var quadElement = $(elt).parents('.quad_element');
    var index = computeSiblingOffset(quadElement);
    var table = quadElement.parentNode.parentNode.parentNode.parentNode;
    var td = $(table).find('tr > td')[index];

    return td;
  }

  function findTabBody (elt) {

    var td = $(elt).parents('td')[0];
    var index = computeSiblingOffset(td);
    var table = $(elt).parents('table')[0];
    var tr = $(table).children('tr')[1];

    return $(tr).find('td > .quad_tab_body > .quad_element')[index];
  }

  function adjustTabBodyColspan (elt) {

    var table = $(elt).parents('table')[0];
    var count = $(table).find('tr > td').length;
    var tr1 = $(table).children('tr')[1];
    var td = $(tr1).children('td')[0];
    setAttribute(td, 'colspan', '' + count);
  }

  //
  // root, stack, undo

  function root (elt) {

    if ( ! elt) return null;
    //if (elt.undoStack) return elt;
    if (hasClass(elt, '.quad_root')) return elt;
    return root(elt.parentNode);
  }

  var TYPES = [
    'text_input', 'select', 'text', 'group', 'date', 'date_md', 'checkbox',
    'text_area'
  ];

  //
  // 'tabs'

  function use_tab_label (container, template, data, options) {

    var td = create(container, 'td', {});

    hide(td, '.quad_label', template[1].label);
    var a = create(td, 'a', '.quad_tab', template[1].label);
    setAttribute(a, 'href', '');
    setAttribute(a, 'onclick', 'Quaderno.showTab(this.parentNode); return false;');

    return td;
  }

  function edit_tab_label (container, template, data, options) {

    if (template === 'new_tab_tab') {

      var td = create(container, 'td', '.new_tab_tab');
      var div = create(td, 'div', '.quad_tab');

      button(
        div, '.quad_plus_button', 'Quaderno.addTab(this);', 'add a new tab');

      return td;
    }
    else {

      return use_tab_label(container, template, data, options);
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

    var tab = $(tr0).find('td > .quad_tab')[0];
    addClass(tab, '.quad_selected');

    // content

    var tr = create(table, 'tr', '.quad_tab_group');
    var td = create(tr, 'td', { 'colspan': tabs.length });
    var qtb = create(td, 'div', '.quad_tab_body');

    for (i = 0; i < template[2].length; i++) {
      var div = renderElement(qtb, tabs[i], data, options);
      if (i != 0) div.style.display = 'none';
    }

    return table;
  }

  var edit_tabs = use_tabs;

  function serialize_tabs (elt) {

    var tabs = [];
    var labels = [];

    var tds = $(elt).find('table > tr > td');
    for (var i = 0; i < tds.length; i++) {
      var lab =
        child(tds[i], '.quad_label') ||
        $(tds[i]).find('.quad_tab > .quad_label')[0];
      if (lab) labels.push(lab.value);
    }

    var trs = $(elt).find('table > tr')[1];
    var tab_body = $(trs).find('td > .quad_tab_body')[0];

    var children = serialize_children(tab_body);
    for (var i = 0; i < children.length; i++) {
      children[i][1].label = labels[i];
    }

    return [ 'tabs', {}, children ];
  }

  //
  // 'group'

  function addArrayElementButtons (arrayMarker, elt) {

    if ( ! arrayMarker) return;

    if (arrayMarker.canRemove) {
      button(
        elt,
        '.quad_minus_button',
        'Quaderno.removeElement(this.parentNode);');
    }
    if (arrayMarker.canReorder) {
      button(
        elt,
        '.quad_up_button',
        'Quaderno.moveElement(this.parentNode, "up");');
      button(
        elt,
        '.quad_down_button',
        'Quaderno.moveElement(this.parentNode, "down");');
    }
  }

  function use_group (container, template, data, options) {

    if ( ! hasClass(container.parentNode, 'quad_tab_body')) {

      addClass(container, '.quad_group');

      hide(container, '.quad_label', template[1].label);
      create(container, 'div', '.quad_key.quad_text', template[1].label);
    }

    var children = template[2];
    var values = [ undefined ];

    var id = options.id || template[1].id;
    var arrayMarker = splitArrayMarker(id);

    if (arrayMarker) {

      values = lookup(data, arrayMarker.id);

      hide(
        container, '.quad_array_children_template', JSON.stringify(children));
    }

    values = values || [];

    for (var j = 0; j < values.length; j++) {

      var opts = dup(options);
      if (arrayMarker) opts.id = arrayMarker.id + '.' + j;

      for (var i = 0; i < children.length; i++) {

        var child = children[i];

        if ( ! arrayMarker && isPropertyId(child[1].id)) {
          opts = dup(opts);
          opts.id = id + child[1].id;
        }

        var e = renderElement(container, child, data, opts);

        if (options.mode !== 'view') addArrayElementButtons(arrayMarker, e);
      }
    }

    if (options.mode !== 'view' && arrayMarker && arrayMarker.canAdd) {
      button(
        container,
        '.quad_plus_button',
        'Quaderno.addToArray(this.parentNode);');
    }
  }

  function addElementButtons (elt) {

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
    button(
      elt,
      '.quad_copy_button',
      'Quaderno.copyElement(this.parentNode.parentNode);');
    button(
      elt,
      '.quad_paste_button',
      'Quaderno.pasteElement(this.parentNode.parentNode);');
  }

  function edit_group (container, template, data, options) {

    if ( ! hasClass(container.parentNode, '.quad_tab_body')) {
      addClass(container, '.quad_group');
    }

    options.novalue = true;
    var gdiv = edit_(container, template, data, options);
    addClass(gdiv, '.quad_group_head');

    if (hasClass(container.parentNode, '.quad_tab_body')) {

      var label = child(gdiv, '.quad_label');
      setAttribute(label, 'onchange', 'Quaderno.tabLabelChanged(this);');

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
      var cdiv = $(c).children('div')[0];
      addElementButtons(cdiv);
    }

    var div = create(container, 'div', {});

    //var sel = create(div, 'select', '.quad_type');
    //for (var i = 0; i < TYPES.length; i++) {
    //  var o = create(sel, 'option', {}, TYPES[i]);
    //}

    button(
      div, '.quad_plus_button', 'Quaderno.addElement(this.parentNode);',
      'add a new element');
    button(
      div, '.quad_paste_button', 'Quaderno.pasteElement(this.parentNode);',
      'insert copied/cut element as last element here');

    return container;
  }

  //
  // 'text'

  function use_text (container, template, data, options) {

    var id = template[1].id;
    var label = template[1].label;

    var value = getValue(template, data, options);
    if (isComposite(value)) value = undefined;

    hide(container, '.quad_label', label);

    label = translate(options, label);

    if (id) {
      create(container, 'div', '.quad_key', label);
      create(container, 'div', '.quad_key.quad_text', lookup(data, id));
    }
    else if (value) {
      create(container, 'div', '.quad_key', label);
      create(container, 'div', '.quad_key.quad_text', value);
    }
    else {
      create(container, 'div', '.quad_key.quad_text', label);
    }
  }

  //
  // 'text_input'

  function use_text_input (container, template, data, options) {

    hide(container, '.quad_label', template[1].label);
    create(container, 'span', '.quad_key', template[1].label);

    var input;

    if (template[0] == 'text_input') {
      input = create(container, 'input', '.quad_value');
      setAttribute(input, 'type', 'text');
    }
    else {
      input = create(container, 'textarea', '.quad_value');
    }

    var value = getValue(template, data, options);
    if (value != undefined) input.value = value;

    if (template[1].id) { // for webrat / capybara
      input.id = 'quad__' + template[1].id.replace(/[\.]/, '_', 'g');
    }

    if (options.mode === 'view') setAttribute(input, 'disabled', 'disabled');
  }

  //
  // 'text_area'

  var use_text_area = use_text_input;

  //
  // 'select'

  function use_select (container, template, data, options) {

    hide(container, '.quad_label', template[1].label);
    create(container, 'span', '.quad_key', template[1].label);

    hide(container, '.quad_values', template[1].values);

    var select = create(container, 'select', '.quad_value');

    var values = getValues(template, data, options);
    var value = getValue(template, data, options);

    for (var i = 0; i < values.length; i++) {
      create(select, 'option', {}, values[i]);
    }

    //select.value = value;
    $(select).val(value);

    if (template[1].id) { // for webrat / capybara
      select.id = 'quad__' + template[1].id.replace(/[\.]/, '_', 'g');
    }

    if (options.mode === 'view') {
      setAttribute(select, 'disabled', 'disabled');
    }
  }

  //
  // date, date_md

  var MD = [ 0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

  function checkDate (elt, type) {

    // TODO : fix leap year

    elt = elt.parentNode;
    var a = serializeDate(elt, type, true);

    if (type === 'ymd') {
      var d = new Date();
      d.setFullYear(a[0], a[1] - 1, a[2]);
      child(elt, '.quad_date_year').value = d.getFullYear();
      child(elt, '.quad_date_month').value = d.getMonth() + 1;
      child(elt, '.quad_date_day').value = d.getDate();
    }

    var sday = child(elt, '.quad_date_day');
    var smonth = child(elt, '.quad_date_month');
    var day = sday.value;
    var month = smonth.value;

    while (sday.firstChild) { sday.removeChild(sday.firstChild); }

    for (var i = 1; i <= MD[month]; i++) {
      create(sday, 'option', { 'value': '' + i }, i);
    }
    sday.value = day;
  }

  function useDate (container, template, data, options, type) {

    if (template[1].label) {
      hide(container, '.quad_label', template[1].label);
      create(container, 'span', '.quad_key', template[1].label);
    }

    // year

    if (type.match(/y/)) {

      create(container, 'span', '.quad_date_separator', 'y');
      var y = (new Date()).getYear() + 1900;
      var sel = create(container, 'select', '.quad_date_year');
      for (var i = 2000; i < 2200; i++) {
        create(sel, 'option', { 'value': '' + i }, i);
      }
      sel.value = y;
      setAttribute(
        sel, 'onchange', 'Quaderno.checkDate(this, "' + type + '");');

      if (template[1].id) { // for webrat / capybara
        sel.id = 'quad__' + template[1].id.replace(/[\.]/, '_', 'g') + '__year';
      }
    }

    // month

    if (type.match(/m/)) {

      create(container, 'span', '.quad_date_separator', 'm');
      var sel = create(container, 'select', '.quad_date_month');
      for (var i = 1; i <= 12; i++) {
        create(sel, 'option', { 'value': '' + i }, i);
      }
      setAttribute(
        sel, 'onchange', 'Quaderno.checkDate(this, "' + type + '");');

      if (template[1].id) { // for webrat / capybara
        sel.id = 'quad__' + template[1].id.replace(/[\.]/, '_', 'g') + '__month';
      }
    }

    // day

    if (type.match(/d/)) {

      create(container, 'span', '.quad_date_separator', 'd');
      var sel = create(container, 'select', '.quad_date_day');
      for (var i = 1; i <= 31; i++) {
        create(sel, 'option', { 'value': '' + i }, i);
      }

      if (template[1].id) { // for webrat / capybara
        sel.id = 'quad__' + template[1].id.replace(/[\.]/, '_', 'g') + '__day';
      }
    }

    // setting value

    var value = getValue(template, data, options);

    if (value) {

      value = value.split('/');

      if (type === 'ymd') {
        child(container, '.quad_date_year').value = new Number(value.shift());
      }
      child(container, '.quad_date_month').value = new Number(value.shift());
      child(container, '.quad_date_day').value = new Number(value.shift());
    }

    if (options.mode === 'view') {

      if (type === 'ymd') {
        var year = child(container, '.quad_date_year');
        setAttribute(year, 'disabled', 'disabled');
      }

      var month = child(container, '.quad_date_month');
      setAttribute(month, 'disabled', 'disabled');

      var day = child(container, '.quad_date_day');
      setAttribute(day, 'disabled', 'disabled');
    }
  }

  function serializeDate (elt, type, raw) {

    if ( ! child(elt, '.quad_date_day')) return serialize_(elt, false);

    var v = [];

    if (type.match(/y/)) v.push(child(elt, '.quad_date_year').value);
    if (type.match(/m/)) v.push(child(elt, '.quad_date_month').value);
    if (type.match(/d/)) v.push(child(elt, '.quad_date_day').value);

    if (raw) return v; // ;-)

    var atts = {};

    atts['value'] = v.join('/');

    fetchAndSet(elt, 'id', atts);
    fetchAndSet(elt, 'label', atts);

    var typename = type === 'ymd' ? 'date' : 'date_md';

    return [ typename, atts, [] ];
  }

  function use_date (container, template, data, options) {
    useDate(container, template, data, options, 'ymd');
  }
  function use_date_md (container, template, data, options) {
    useDate(container, template, data, options, 'md');
  }

  function serialize_date (elt) {
    return serializeDate(elt, 'ymd');
  }
  function serialize_date_md (elt) {
    return serializeDate(elt, 'md');
  }

  //
  // checkbox

  function use_checkbox (container, template, data, options) {

    var value = getValue(template, data, options);
    value = value || {};
    var text = value['text'];
    var checked = value['checked'];
    value = value['value'];

    hide(container, '.quad_label', template[1].label);
    //create(container, 'span', '.quad_key', template[1].label);

    var checkbox = create(
      container,
      'input',
      { 'class': 'quad_checkbox',
        'type': 'checkbox',
        'value': value });
    if (checked) setAttribute(checkbox, 'checked', 'checked');
    if (options.mode === 'view') setAttribute(checkbox, 'disabled', 'disabled');

    create(container, 'span', '.quad_checkbox_key', template[1].label);

    create(container, 'span', '.quad_text', text);
  }

  function serialize_checkbox (elt) {

    var checkbox = child(elt, '.quad_checkbox');

    if ( ! checkbox) return serialize_(elt, false);

    var type = child(elt, '.quad_type').value;

    var atts = {};

    fetchAndSet(elt, 'id', atts, 'checkbox');
    fetchAndSet(elt, 'label', atts, 'checkbox');
    fetchAndSet(elt, 'title', atts, 'checkbox');

    var text = child(elt, '.quad_text');

    atts['value'] = { 'value': checkbox.value, 'text': text.innerHTML };

    if (checkbox.checked) atts['value']['checked'] = true;

    return [ type, atts, [] ];
  }

  //
  // *

  function idKeyPress (evt) {

    if (evt.keyCode !== 13) return true;

    var elt = evt.target;
    var keys = root(elt).keys;

    var iv = keys.indexOf(elt.value);

    if (iv === keys.length - 1) return false;

    if (iv > -1) {
      elt.value = keys[iv + 1] || '';
      return false;
    }

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if ( ! key.match("^" + elt.value)) continue;
      //if (key === elt.value) continue;
      elt.value = key;
      break;
    }

    return false;
  }

  function use_ (container, template, data, options) {

    create(container, 'span', {}, JSON.stringify(template));
  }

  function edit_ (container, template, data, options) {

    var div = create(container, 'div', {});

    //var novalue = options.novalue;

    if (template[0] === 'group') {
      create(div, 'span', '.quad_type', 'group');
    }
    else {
      var sel = create(div, 'select', '.quad_type');
      for (var i = 0; i < TYPES.length; i++) {
        var t = TYPES[i];
        var o = create(sel, 'option', {}, t);
        if (t === template[0]) setAttribute(o, 'selected', 'selected');
      }
      setAttribute(sel, 'onchange', 'Quaderno.typeChanged(this)');
    }

    var tiid = createTextInput(div, 'id', template, data, options);
    setAttribute(tiid, 'onkeypress', 'return Quaderno.idKeyPress(event)');
    tiid.title = "hit 'enter' to jump between ids known via the data set";

    createTextInput(div, 'label', template, data, options);
    createTextInput(div, 'title', template, data, options);

    if (template[0] !== 'group') {
      createTextInput(div, 'value', template, data, options);
    }
    if (template[0] === 'select') {
      createTextInput(div, 'values', template, data, options);
    }

    //delete options.novalue;

    return div;
  }

  function serialize_children (elt) {

    var r = [];
    var elts = children(elt, '.quad_element');

    for (var i = 0; i < elts.length; i++) {
      r.push(serializeElement(elts[i]));
    }

    return r;
  }

  function serialize_ (elt, serializeChildren) {

    if (serializeChildren == undefined) serializeChildren = true;

    var type = child(elt, '.quad_type').value;

    var atts = {};

    fetchAndSet(elt, 'id', atts, type);
    fetchAndSet(elt, 'label', atts, type);
    fetchAndSet(elt, 'title', atts, type);
    fetchAndSet(elt, 'value', atts, type);
    fetchAndSet(elt, 'values', atts, type);

    var cs = [];
    if (serializeChildren) cs = serialize_children(elt);

    return [ type, atts, cs ];
  }

  //
  // methods

  function extractKeys (data, prefix, result) {

    prefix = prefix || '';
    result = result || [];

    for (var k in data) {
      var pk = prefix + k;
      var v = data[k];
      if ($.isArray(v)) {
        result.push(pk + '.');
      }
      else if (v && v.constructor === Object) {
        result.push(pk);
        extractKeys(v, pk + '.', result);
      }
      else {
        result.push(pk);
      }
    }

    return result.sort();
  }

  function editElement (container, template, data, options) {

    var div = create(container, 'div', '.quad_element');

    hide(div, '.quad_type', template[0]);

    var f = lookupFunction('edit_', template);
    f(div, template, data, options);

    return div;
  }

  function useElement (container, template, data, options) {

    //var f = lookupFunction(options.mode + '_', template);
    var f = lookupFunction('use_', template);

    var div = create(container, 'div', '.quad_element');

    var id = template[1].id;
    if (id) hide(div, '.quad_id', id);

    if (template[1].title) {
      hide(div, '.quad_title', template[1].title);
      setAttribute(div, 'title', translate(options, template[1].title));
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

    var type = child(container, '.quad_type').value;
    var f = lookupFunction('serialize_', type);

    return f(container);
  }

  function setValue (data, k, v) {

    if (k === undefined) return;
    if (v === undefined) return;

    var m = k.match(/([^\.]+)\.(.+)$/)

    if ( ! m) {

      if (k === '0' && $.isArray(data)) data.splice(0, data.length);

      data[k] = v;
      return;
    }

    var target = data[m[1]];

    if (target === undefined && $.isArray(data)) {
      data[m[1]] = {};
      target = data[m[1]];
    }

    if ( ! target) { data[k] = v; return; }

    setValue(target, m[2], v);
  }

  function produceElement (elt, data, parentId, childIndex) {

    var id = elt[1].id;
    var value = elt[1].value;

    if (isPropertyId(id) && parentId) id = parentId + id;

    var arrayMarker = splitArrayMarker(parentId);
    if (arrayMarker) id = arrayMarker.id + '.' + childIndex;

    setValue(data, id, value);

    // children

    for (var i = 0; i < elt[2].length; i++) {
      var c = elt[2][i];
      produceElement(c, data, id, i);
    }
  }

  //
  // onClick public methods

  function showTab (td) {

    for (var i = 0; i < td.parentNode.children.length; i++) {
      var tab = child(td.parentNode.children[i], '.quad_tab');
      removeClass(tab, 'quad_selected');
    }
    var tab = child(td, '.quad_tab');
    addClass(tab, '.quad_selected');

    var tab_body = findTabBody(tab);

    for (var i = 0; i < tab_body.parentNode.children.length; i++) {
      tab_body.parentNode.children[i].style.display = 'none';
    }
    tab_body.style.display = 'block';
  }

  function removeTab (elt) {

    stack(elt);

    var quadElement = $(elt).parents('.quad_element')[0];
    var td = findTab(elt);

    var next = td.nextSibling;
    if (hasClass(next, '.new_tab_tab')) next = td.previousSibling;

    if ( ! next) return; // can't remove last tab

    quadElement.parentNode.removeChild(quadElement);
    td.parentNode.removeChild(td);

    showTab(next);
  }

  function moveTab (elt, direction) {

    stack(elt);

    var qe = $(elt).parents('.quad_element')[0];
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

  function addTab (elt) {

    stack(elt);

    var td = $(elt).parents('.new_tab_tab')[0];

    var template = [ 'group', { 'label': 'new' }, [] ];

    var ntd = use_tab_label(td.parentNode, template);
    td.parentNode.insertBefore(ntd, td);

    adjustTabBodyColspan(elt);

    var table = $(td).parents('table')[0];
    var tr1 = $(table).children('tr')[1];
    var body = $(tr1).find('td > .quad_tab_body')[0];

    var r = root(elt);

    var nelt = renderElement(body, template, r.data, { 'mode': 'edit' });
    nelt.style.display = 'none';
  }

  function addElement (elt) {

    stack(elt);

    var blank = [ 'text_input', {}, [] ];

    var newElement = editElement(elt.parentNode, blank, {}, {});
    addElementButtons($(newElement).children('div')[0]);

    elt.parentNode.insertBefore(newElement, elt);
  }

  function moveElement (elt, direction) {

    stack(elt);

    if (direction === 'up') {
      if (elt.previousSibling && ( ! hasClass(elt.previousSibling, '.quad_group_head')))
        elt.parentNode.insertBefore(elt, elt.previousSibling);
    }
    else {
      if (elt.nextSibling && hasClass(elt.nextSibling, '.quad_element'))
        elt.parentNode.insertBefore(elt.nextSibling, elt);
    }
  }

  function removeElement (elt) {

    stack(elt);

    root(elt).clipboard = elt;
    elt.parentNode.removeChild(elt);
  }

  function copyElement (elt) {

    root(elt).clipboard = elt.cloneNode(true);
  }

  function pasteElement (elt) {

    var clip = root(elt).clipboard;
    if ( ! clip) return;

    stack(elt);
    elt.parentNode.insertBefore(clip.cloneNode(true), elt);
  }

  function addToArray (elt) {

    stack(elt);

    var t = child(elt, '.quad_array_children_template');
    var t = JSON.parse(t.value);

    var r = root(elt);

    var arrayMarker = splitArrayMarker(child(elt, '.quad_id').value);

    for (var i = 0; i < t.length; i++) {
      var e = renderElement(elt, t[i], r.data, { 'mode': 'use' });
      addArrayElementButtons(arrayMarker, e);
    }
      //
      // translations are gone !!!

    var button = child(elt, '.quad_plus_button');
    elt.appendChild(button);
      // reposition plus button at the end
  }

  function tabLabelChanged (elt) {

    var newLabel = $.trim(elt.value);
    elt.value = newLabel;

    var quad_element = elt.parentNode.parentNode;
    var i = computeSiblingOffset(quad_element);
    var table = quad_element.parentNode.parentNode.parentNode.parentNode;
    var td = $(table).find('tr > td')[i];
    var input = $(td).children('input')[0];
    var a = $(td).children('a')[0];

    input.value = newLabel;
    a.innerHTML = newLabel;
  }

  function typeChanged (elt) {

    var qe = elt.parentNode.parentNode;
    var t = serialize_(qe, false);

    t[0] = elt.value;
    var e = editElement(qe, t, root(qe).data, { 'mode': 'edit' });
    addElementButtons($(e).children('div')[0]);

    qe.parentNode.replaceChild(e, qe);
  }

  function stack (elt) {

    var r = root(elt);
    r.undoStack.push(serialize(r));
  }

  //
  // public methods

  function render (container, template, data, options) {

    setParent(template);

    data = data || {};

    options = options || {};
    options.mode = options.mode || 'view';

    container = toElement(container);

    var fc; while (fc = container.firstChild) { container.removeChild(fc); }

    container.mode = options.mode;
    container.data = data;
    container.keys = extractKeys(data);
    container.undoStack = [ template ];

    renderElement(container, template, data, options);
  }

  function serialize (container) {

    return serializeElement(child(toElement(container), '.quad_element'));
  }

  function produce (container) {

    container = toElement(container);

    var template = serialize(container);

    //var data = JSON.parse(JSON.stringify(container.data));
    var data = container.data;

    produceElement(template, data);

    return data;
  }

  function undo (containerId) {

    var container = document.getElementById(containerId);
    var stack = container.undoStack;
    var template = stack.pop();

    render(container, template, container.data, { 'mode': container.mode });

    if (stack.length < 1) stack.push(template);

    container.undoStack = stack;
  }

  function reset (containerId) {

    var container = document.getElementById(containerId);

    var template = container.undoStack[0];

    render(container, template, container.data, { 'mode': container.mode });

    container.undoStack = [ template ];
  }

  //
  // that's all folks...

  return {

    // public for onClick or onChange

    showTab: showTab,
    removeTab: removeTab,
    moveTab: moveTab,
    addTab: addTab,
    addElement: addElement,
    moveElement: moveElement,
    removeElement: removeElement,
    copyElement: copyElement,
    pasteElement: pasteElement,
    addToArray: addToArray,
    tabLabelChanged: tabLabelChanged,
    typeChanged: typeChanged,
    checkDate: checkDate,
    idKeyPress: idKeyPress,
    stack: stack,

    // public

    render: render,
    serialize: serialize,
    produce: produce,
    undo: undo,
    reset: reset
  };
}();

