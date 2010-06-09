
//
// using the datepicker at
// http://www.frequency-decoder.com/2009/09/09/unobtrusive-date-picker-widget-v5
//

// TODO : prevent html/js injection !

var Quaderno = function () {

  function clog () {
    if (arguments.length == 1) console.log(arguments[0]);
    else console.log(arguments);
  }

  //
  // misc

  function isArray (o) {
    if (o == null) return false;
    return (o.constructor == Array);
  }

  function strip (s) {
    return s.replace(/^\s+|\s+$/g, '');
  }

  function create (container, tagName, attributes, innerHTML) {

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
      //e.innerHTML = innerText;
        // doesn't work with Safari
      e.appendChild(document.createTextNode(innerText));
    }
    if (container) {
      container.appendChild(e);
    }

    return e;
  }

  function identify (path) {

    var cs = [];
    var i = null;
    var t = null;

    var s = path;

    while (m = s.match(/^ *([#\.][^#\. ]+)/)) {
      var m = m[1];
      var ms = m.slice(1, m.length);
      if (m[0] == '.') cs.push(ms);
      else if (m[0] == '#') i = ms;
      else t = m.toLowerCase();
      s = s.slice(m.length, s.length);
    }

    var cn = cs.join(' ');

    return {
      'className': cn,
      'id': i,
      'tagName': t,
      'accepts': function (elt) { return hasClass(elt, cn); }
    };
  }

  function hide (container, path, value) {

    var i = identify(path);

    var e = create(container, 'input', { 'type': 'hidden', 'value': value });

    if (i.className) e.setAttribute('class', i.className);
    else if (i.id) e.id = i.id;
  }

  function button (container, className, onclick) {

    if ( ! onclick.match(/return false;$/)) onclick += " return false;";
    if (className[0] == '.') className = className.slice(1, className.length);

    title = {
      'quad_plus_button': 'add',
      'quad_minus_button': 'remove',
      'quad_up_button': 'move up',
      'quad_down_button': 'move down',
      'quad_copy_button': 'copy',
      'quad_cut_button': 'cut',
      'quad_paste_button': 'paste',
      'quad_go_button': 'go',
    }[className];

    return create(
      container,
      'a',
      { 'href': '',
        'class': className + ' quad_button',
        'title': title,
        'onclick': onclick });
  }

  function select (container, identity, value, values, onchange) {

    var s = create(container, 'select', identity);
    if (onchange) s.setAttribute('onchange', onchange);

    for (var i = 0; i < values.length; i++) {
      var v = values[i];
      var o = create(s, 'option', {}, v);
      if (v == value) o.setAttribute('selected', 'selected');
    }

    return s;
  }

  //
  // types

  var TYPE_BLANKS = {
    'text': {
      'label': '', 'value': '', 'title': '' },
    'boolean': {
      'label': '', 'value': false, 'title': '' },
    'date': {
      'label': '', 'value': '', 'title': '' },
    'select': {
      'label': '', 'value': '', 'values': [ 'a', 'b' ], 'title': '' },
    'link': {
      'label': '', 'value': '', 'title': '' },
    'tab_group': {
      'label': '', 'elements': [] },
    'group': {
      'label': '', 'elements': [] },
  }

  var TYPES = [];

  for (var k in TYPE_BLANKS) {
    TYPES.push(k);
    TYPE_BLANKS[k]['type'] = k;
  }

  // support_data ftw
  //
  function resolve (value) {

    var r = {};
    r.original = value;
    r.editable = value;
    r.isRef = false;

    if (((typeof value) == 'string') && (m = value.match(/^(@[^\.]+)(.*)$/))) {
      r.resolved = eval("support_data['" + m[1] + "']" + m[2]);
      r.isRef = true;
    }
    else {
      r.resolved = value;
      if (isArray(r.resolved)) r.editable = value.join(',');
    }
    return r;
  }

  // Returns the value for an element, with a preference for its 'original'
  // value if any
  //
  function fetchValue (container) {

    var v = children(container, '.quad_value', 'first');
    var ov = children(container, '.quad_original_value', 'first');

    if (ov) return ov.value || ov.innerHTML;
    return v.value || v.innerHTML;
  }

  // tab_group

  function render_tab_group (container, data, mode) {

    var elts = data['elements'];

    var t = create(container, 'table', '.quad_tab_group');
    var trh = create(t, 'tr', '.quad_tab_group');
    var trb = create(t, 'tr', '.quad_tab_group');
    var tdb = create(trb, 'td', '.quad_tab_group');
    var divb = create(tdb, 'div', '.quad_tab_body');
    tdb.setAttribute('colspan', elts.length);

    for (var i = 0; i < elts.length; i++) {

      var elt = elts[i];

      // tab

      var td = create(trh, 'td', {});

      if (mode == 'edit') {

        var d = create(td, 'div', '.quad_tab');
        if (i == 0) d.className += ' quad_selected';

        var ni = create(d, 'input', '.quad_tab_label');
        ni.type = 'text';
        ni.value = elt['label'];

        button(d, '.quad_go_button', 'Quaderno.showTab(this, ' + i + ');');
        button(d, '.quad_minus_button', 'Quaderno.removeTab(this, ' + i + ');');
      }
      else {

        hide(td, '.quad_tab_label', elt['label']);

        var a = create(td, 'a', { 'href': '' }, elt['label']);
        a.className = 'quad_tab';
        if (i == 0) a.className += ' quad_selected';
        a.setAttribute(
          'onclick', 'Quaderno.showTab(this, ' + i + '); return false;');
      }

      // content

      var d = create(divb, 'div', '.quad_tab_element');
      if (i == 0) d.style.display = 'block';
      
      renderElement(d, elt, mode);
    }

    if (mode == 'edit') {

      tdb.setAttribute('colspan', elts.length + 1);

      var td = create(trh, 'td', {});
      var dp = create(td, 'div', '.quad_tab');
      button(dp, '.quad_plus_button', 'Quaderno.addTab(this);');
    }
  }

  function tab_group_toData (container) {

    var d = { 'type': 'tab_group', 'elements': [] };

    var hs = container.firstChild.children[0].children;
    var es = container.firstChild.children[1].firstChild.firstChild.children

    for (var i = 0; i < es.length; i++) {

      var ed = elementToData(es[i]);

      var qt = children(hs[i], '.quad_tab', 'first');
      var qtl = children(qt, '.quad_tab_label', 'first') || qt;
      ed['label'] = qtl.value || qtl.innerHTML;

      d['elements'].push(ed);
    }

    return d;
  }

  // group

  function render_group (container, data, mode) {

    var es = data['elements'];

    var d = create(container, 'div', '.quad_elements');

    if ( ! hasClass(container, 'quad_tab_element')) {
      d.className += ' quad_group';
    }

    if (hasClass(container, 'quad_element')) {
      renderLabel(d, data, mode);
    }

    for (var i = 0; i < es.length; i++) {
      renderElement(create(d, 'div', '.quad_element'), es[i], mode);
    }

    if (mode == 'edit' && ( ! container.undoStack)) {
      var dne = create(d, 'div', '.quad_new_element');
      select(dne, {}, 'text', TYPES);
      button(dne, '.quad_plus_button','Quaderno.addElement(this);');
    }
  }

  function group_toData (container) {

    var d = { 'type' : 'group', 'elements': [] };
    var es = somepath(container, '.quad_elements/.quad_element');

    for (var i = 0; i < es.length; i++) {
      d['elements'].push(elementToData(es[i]));
    }

    return d;
  }

  // text

  function render_text (container, data, mode) {

    var value = resolve(data['value']);

    renderLabel(container, data, mode);

    if (mode == 'edit') create(container, 'span', '.quad_label_e', 'value');

    if (mode == 'view') {

      if (value.isRef) hide(container, '.quad_original_value', value.original);
      create(container, 'span', '.quad_value', value.resolved);
    }
    else if (mode == 'use') {

      if (value.isRef) {
        hide(container, '.quad_original_value', value.original);
        create(container, 'span', '.quad_value', value.resolved);
      }
      else {
        create(
          container,
          'input',
          { 'class': 'quad_value',
            'type': 'text',
            'value': value.original,
            'onchange' : 'Quaderno.stack(this);'
          });
      }
    }
    else { //if (mode == 'edit') {

      create(
        container,
        'input',
        { 'class': 'quad_value',
          'type': 'text',
          'value': value.original,
          'onchange' : 'Quaderno.stack(this);'
        });
    }
  }

  function text_toData (container) {

    var d = { 'type' : 'text' };

    labelToData(container, d);

    var v = fetchValue(container);
    if (v) d['value'] = v;

    return d;
  }

  // link

  function render_link (container, data, mode) {

    var value = resolve(data['value']);

    renderLabel(container, data, mode);

    if (mode == 'edit') create(container, 'span', '.quad_label_e', 'value');

    if (mode == 'view' || mode == 'use') {
      hide(container, '.quad_original_value', value.original);
      var a = create(container, 'a', '.quad_value', value.resolved);
      a.href = value.resolved;
      a.target = data['target'];
      hide(container, '.quad_link_target', data['target']);
    }
    else { //if (mode == 'edit') {
      create(
        container,
        'input',
        { 'class': 'quad_value',
          'type': 'text',
          'value': value.original,
          'onchange' : 'Quaderno.stack(this);'
        });
      create(container, 'span', '.quad_label_e', 'target');
      create(
        container,
        'input',
        { 'class': 'quad_link_target',
          'type': 'text',
          'value': data['target'],
          'onchange' : 'Quaderno.stack(this);'
        });
    }
  }

  function link_toData (container) {

    var d = text_toData(container);
    d.type = 'link';

    var t = children(container, '.quad_link_target', 'first');
    if (t) {
      var v = strip(t.value)
      if (v != '') d.target = v;
    }

    return d;
  }

  // circle

  function render_circle (container, data, mode) {

    renderLabel(container, data, mode);

    var value = data['value'];
    var values = data['values'];
    if (( ! value) || strip(value) == '') value = values[0];

    if (mode != 'edit') hide(container, '.quad_values', values.join(','));

    if (mode == 'view') {
      create(container, 'span', '.quad_value.quad_circle', value);
    }
    else if (mode == 'use' || mode =='edit') {
      if (mode == 'edit') create(container, 'span', '.quad_label_e', 'value');
      var s = create(container, 'span', '.quad_value.quad_circle', value);
      s.setAttribute('onclick', 'Quaderno.circle_onclick(this);');
      s.values = values;
    }

    if (mode == 'edit') {
      create(
        container,
        'input',
        { 'class': 'quad_values',
          'type': 'text',
          'value': values.join(','),
          'onchange' : 'Quaderno.circle_onchange(this); Quaderno.stack(this);'
        });
    }
  }

  function circle_toData (container) {

    var d = { 'type': 'circle' };

    labelToData(container, d);

    var v = fetchValue(container);
    var vs = children(container, '.quad_values', 'first').value;
    vs = vs.split(',');
    d.value = v;
    d.values = vs;

    return d;
  }

  function circle_onclick (e) {

    var v = e.innerHTML;
    var found = false;

    for (var i = 0; i < e.values.length; i++) {
      var vv = e.values[i];
      if (found) {
        e.innerHTML = vv;
        return;
      }
      found = (v == vv);
    };

    e.innerHTML = e.values[0];
  }

  function circle_onchange (e) {
    e.previousSibling.values = e.value.split(',');
  }

  // boolean

  function render_boolean (container, data, mode) {

    var value = resolve(data['value']);

    renderLabel(container, data, mode);

    var cb = create(container, 'input', '.quad_value');
    cb.setAttribute('type', 'checkbox');
    if (value.resolved) cb.setAttribute('checked', 'checked');

    var ov = null;

    if (mode == 'view') {
      cb.setAttribute('disabled', 'true');
      if (value.isRef) hide(container, '.quad_original_value', value.original);
    }
    else if (mode == 'use') {
      if (value.isRef) {
        cb.setAttribute('disabled', 'true');
        hide(container, '.quad_original_value', value.original);
      }
    }
    else { //if (mode == 'edit') {
      var ov = create(container, 'input', '.quad_original_value');
      ov.setAttribute('type', 'text');
      ov.setAttribute('onchange', 'Quaderno.boolean_ov_onchange(this);');
      if (value.isRef) ov.value = value.original;
      boolean_ov_onchange(ov);
    }
  }

  function boolean_toData (container) {

    var d = { 'type' : 'boolean' };

    var v = children(container, '.quad_value', 'first');
    var ov = children(container, '.quad_original_value', 'first');
    var ov = (ov && ov.value) ? strip(ov.value) : null;

    if (ov && ov.match(/^@.+/)) d['value'] = ov;
    else d['value'] = (v.checked == true);

    labelToData(container, d);

    return d;
  }

  function boolean_ov_onchange (e) {

    var v = resolve(e.value);
    var cb = e.previousSibling;

    if (v.isRef) {
      cb.setAttribute('disabled', true);
      if (v.resolved) cb.setAttribute('checked', 'checked');
      else cb.removeAttribute('checked');
    }
    else {
      cb.removeAttribute('disabled');
    }
  }

  // date

  // NOTE : no resolution / @ trick for dates (use a text field)

  function render_date (container, data, mode) {

    renderLabel(container, data, mode);

    if (mode == 'view') {
      create(container, 'span', '.quad_value', data['value']);
    }
    else {
      var ind = create(container, 'input', '.quad_value.quad_date');
      ind.setAttribute('type', 'text');
      ind.setAttribute('value', data['value']);
    }
  }

  function date_toData (container) {

    var d = { 'type': 'date' };

    labelToData(container, d);

    //var v = children(container, '.quad_value', 'first');
    var v = fetchValue(container);

    d['value'] = v;

    return d;
  }

  // select

  function select_onchange (e) {

    var values = e.value.split(',');
    for (var i = 0; i < values.length; i++) { values[i] = strip(values[i]); }
    var value = values[0];

    var s0 = e.previousSibling;
    var s1 = select(
      e.parentNode, '.quad_value', value, values, 'Quaderno.stack(this);');

    e.parentNode.replaceChild(s1, s0);
  }

  function render_select (container, data, mode) {

    var values = data['values'];
    values = resolve(values);

    renderLabel(container, data, mode);

    if (mode == 'edit') create(container, 'span', '.quad_label_e', 'value');

    if (mode == 'view') {
      create(
        container, 'span', '.quad_value', data['value']);
    }
    else {
      select(
        container,
        '.quad_value',
        data['value'],
        values.resolved,
        'Quaderno.stack(this);');
    }

    if (mode == 'edit') {

      var values = create(
        container,
        'input',
        { 'type': 'text',
          'value': values.editable,
          'class': 'quad_values',
          'onchange': 'Quaderno.stack(this); Quaderno.select_onchange(this);' });
    }
    else {
      hide(container, '.quad_values', JSON.stringify(values.original));
    }
  }

  function select_toData (container) {

    var d = { 'type': 'select' };

    labelToData(container, d);

    var vs = children(container, '.quad_values', 'first');

    if (((typeof vs.value) == 'string') && (vs.value.match(/^@.+/))) {

      d['values'] = vs.value;
    }
    else if (isArray(vs.value)) {

      d['values'] = vs.value;
    }
    else {

      try { d['values'] = JSON.parse(vs.value); }
      catch (e) { d['values'] = vs.value.split(','); }
    }

    if (isArray(d['values'])) {
      for (var i = 0; i < d['values'].length; i++) {
        d['values'][i] = strip(d['values'][i]);
      }
    }

    var v = children(container, '.quad_value', 'first');
    if (v) d['value'] = v.value || v.innerHTML;

    return d;
  }

  //
  // render functions

  // mainly binding date pickers to the .quad_date things
  //
  function postRender (container) {

    var dinputs = allChildren(container, '.quad_date');

    var off = (new Date()).getTime().toString();

    for (var i = 0; i < dinputs.length; i++) {

      dinputs[i].id = 'quad_date_' + off + '_' + i;

      var opts = { 'formElements': {} };
      opts.formElements[dinputs[i].id] = 'Y-sl-m-sl-d';

      if (document._testing != true)
        datePickerController.createDatePicker(opts);
    }
  }

  function renderLabel (container, data, mode) {

    if (mode == 'edit') {

      create(container, 'span', '.quad_label_e', 'label');

      create(
        container,
        'input',
        { 'type': 'text', 'class': 'quad_label', 'value': data['label'] });
    }
    else {

      create(container, 'span', '.quad_label', data['label']);
    }
  }

  function renderElement (container, data, mode, post) {

    container.innerHTML = '';

    if (data['title']) container.setAttribute('title', data['title']);

    var func = null;
    try {
      func = eval('render_' + data['type'])
    }
    catch (e) {
      alert("no render_ method for type '" + data['type'] + "'"); return;
    }
    func(container, data, mode);

    hide(container, '.quad_type', data['type']);

    if (mode != 'edit') {
      hide(container, '.quad_repeatable', data['repeatable']);
    }

    if (data['repeatable'] && (mode == 'use')) {

      var buttons = create(container, 'span', '.quad_repeatable_buttons');

      button(buttons, '.quad_plus_button', 'Quaderno.repeatElement(this);');
      button(buttons, '.quad_minus_button', 'Quaderno.removeElement(this);');
    }

    if (mode == 'edit' && (
      ! (container.undoStack || hasClass(container, '.quad_tab_element')))) {

      var s = create(container, 'span', '.quad_rep');
      create(s, 'span', {}, 'repeatable');
      var inr = create(s, 'input', '.quad_repeatable');
      inr.setAttribute('type', 'checkbox');
      if (data['repeatable']) inr.setAttribute('checked', 'checked');

      button(container, '.quad_up_button', 'Quaderno.moveElement(this, "up");');
      button(container, '.quad_down_button', 'Quaderno.moveElement(this, "down");');
      button(container, '.quad_cut_button', 'Quaderno.cutElement(this);');
      button(container, '.quad_copy_button', 'Quaderno.copyElement(this);');
      button(container, '.quad_paste_button', 'Quaderno.pasteElement(this);');
    }

    if (post) postRender(container);
  }

  // Returns this quad's root element
  //
  function root (elt) {
    if ( ! elt) return null;
    if (elt.undoStack) return elt;
    return root(elt.parentNode);
  }

  function hasClass (elt, className) {
    if (className[0] == '.') className = className.slice(1, className.length);
    var ks = elt.className.split(' ');
    for (var i = 0; i < ks.length; i++) {
      if (ks[i] == className) return true;
    }
    return false;
  }

  function parentTr (e) {
    if (e.tagName.toLowerCase() == 'tr') return e;
    return parentTr(e.parentNode);
  }

  function children (elt, path, index) {
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

  function allChildren (elt, className, accumulator) {
    if ( ! accumulator) accumulator = [];
    if (hasClass(elt, className)) accumulator.push(elt);
    for (var i = 0; i < elt.children.length; i++) {
      allChildren(elt.children[i], className, accumulator);
    }
    return accumulator;
  }

  //// breadth-first descendant lookup
  ////
  //function descendant (elt, className) {
  //  var i = null;
  //  for (i = 0; i < elt.children.length; i++) {
  //    var c = elt.children[i];
  //    if (hasClass(c, className)) return c;
  //  }
  //  //for (i = 0; i < elt.children.length; i++) {
  //  for (i = elt.children.length - 1; i > -1; i--) {
  //    // starting at the end...
  //    var r = descendant(elt.children[i], className);
  //    if (r) return r;
  //  }
  //  return null;
  //}

  function somepath (elt, path) {

    var start = [ elt ];

    if ((typeof path) == 'string') path = path.split('/');

    var p = null;

    while (p = path.shift()) {
      start = start[0];
      var c = children(start, p);
      if (c.length == 0) return [];
      start = c;
    }
    return start;
  }

  function labelToData(container, data) {
    var v = children(container, '.quad_label', 'first');
    if (v) data['label'] = v.value || v.innerHTML;
  }

  function elementToData (container) {

    var type = children(container, '.quad_type', 'first').value;

    var d = eval(type + '_toData')(container);

    if (container.title) d['title'] = container.title;

    var pa = container;
    var qr = children(container, '.quad_rep', 'first');
    if (qr) pa = qr;
    qr = children(pa, '.quad_repeatable', 'first');
    if (qr && (qr.checked == true || ('' + qr.value) == 'true')) {
      d['repeatable'] = true;
    }

    return d;
  }

  function toData (containerId) {

    return elementToData(document.getElementById(containerId));
  }

  //
  // public functions

  function render (containerId, data, mode) {

    if ( ! mode) mode = 'use';

    var container = document.getElementById(containerId);

    container.mode = mode;
    container.undoStack = [ data ];

    renderElement(container, data, mode, true);
  }

  function showTab (e, index) {
    var i = null;
    var s = parentTr(e).children;
    for (i = 0; i < s.length; i++) {
      var qt = children(s[i], '.quad_tab', 'first');
      qt.className = 'quad_tab';
      if (i == index) qt.className += ' quad_selected';
    }
    var tdb = parentTr(e).nextSibling.firstChild;
    var divb = tdb.firstChild;
    for (i = 0; i < divb.children.length; i++) {
      divb.children[i].style.display = (i == index) ? 'block' : 'none';
    }
  }

  function repeatElement (e) {
    stack(e);
    var c0 = e.parentNode.parentNode;
    var c1 = c0.cloneNode(true);
    c0.parentNode.insertBefore(c1, c0);
  }

  function removeElement (e) {
    stack(e);
    var c = e.parentNode.parentNode;
    c.parentNode.removeChild(c);
  }

  function moveElement (e, direction) {
    stack(e);
    var c = e.parentNode;
    if (direction == 'up') {
      if (c.previousSibling)
        c.parentNode.insertBefore(c, c.previousSibling);
    }
    else {
      if (c.nextSibling && hasClass(c.nextSibling, 'quad_element'))
        c.parentNode.insertBefore(c.nextSibling, c);
    }
  }

  function cutElement (e) {
    stack(e);
    var c = e.parentNode;
    root(e).clipboard = c;
    c.parentNode.removeChild(c);
  }

  function copyElement (e) {
    root(e).clipboard = e.parentNode.cloneNode(true);
  }

  function pasteElement (e) {
    var clip = root(e).clipboard;
    if ( ! clip) return;
    stack(e);
    var c = e.parentNode;
    c.parentNode.insertBefore(clip.cloneNode(true), c);
  }

  function addElement (e) {
    stack(e);
    var t = e.previousSibling.value;
    var b = TYPE_BLANKS[t];
    var c = create(e, 'div', '.quad_element');
    e.parentNode.parentNode.insertBefore(c, e.parentNode);
    var ne = renderElement(c, b, 'edit', true);
  }

  function addTab (e) {
    stack(e);
    var c = e.parentNode.parentNode.parentNode.parentNode.parentNode;
    var d = elementToData(c);
    d['elements'].push(TYPE_BLANKS['group']);
    renderElement(c, d, 'edit', true);
  }

  function removeTab (e, index) {
    stack(e);
    var c = e.parentNode.parentNode.parentNode.parentNode.parentNode;
    var d = elementToData(c);
    d['elements'].splice(index, 1);
    renderElement(c, d, 'edit', true);
  }

  // Stacks the state of the form for a potential undo
  //
  function stack (elt) {
    var r = root(elt);
    var d = toData(r.id);
    //if (r.undoStack[r.undoStack.length - 1] == d) return;
    r.undoStack.push(d);
  }

  function reset (containerId) {
    var container = document.getElementById(containerId);
    var data = container.undoStack.shift();
    render(containerId, data, container.mode, true);
  }

  function undo (containerId) {
    var container = document.getElementById(containerId);
    var data = container.undoStack.pop();
    if (container.undoStack.length < 1) container.undoStack.push(data);
    renderElement(container, data, container.mode, true);
  }

  return {

    //
    // only for testing

    identify: identify,

    //
    // not so public methods

    repeatElement: repeatElement,
    addElement: addElement,
    removeElement: removeElement,
    moveElement: moveElement,
    cutElement: cutElement,
    copyElement: copyElement,
    pasteElement: pasteElement,
    addTab: addTab,
    removeTab: removeTab,
    stack: stack,

    // specific to element types

    select_onchange: select_onchange,
    boolean_ov_onchange: boolean_ov_onchange,
    circle_onclick: circle_onclick,
    circle_onchange: circle_onchange,

    //
    // public methods

    render: render,
    showTab: showTab,
    toData: toData,
    reset: reset,
    undo: undo
  };
}();

