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

// depends on the excellent jquery[-1.4.2]


// TODO : prevent html/js injection !

var Quaderno = function () {

  //
  // misc

  // TODO : print() is a ffox function !!!! :-( fix
  //
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

  function removeClassDot (cname) {
    return (cname[0] === '.') ? cname.slice(1) : cname;
  }

  function hide (container, cname, value) {
    cname = removeClassDot(cname);
    return create(
      container, 'input', { 'class': cname, 'type': 'hidden', 'value': value });
  }

  function create (container, tagName, attributes, innerText) {

    var atts = attributes || {};

    if (attributes && ((typeof attributes) === 'string')) {
      attributes = $.trim(attributes.split('.').join(' '));
      atts = { 'class': attributes };
    }

    var e = $('<' + tagName + '/>', atts)[0];

    if (innerText) {
      //e.innerHTML = innerText; // doesn't work with Safari
      e.appendChild(document.createTextNode(innerText));
    }

    if (container) {
      container.appendChild(e);
    }

    return e;
  }

  function button (container, className, onclick, title) {

    if ( ! onclick.match(/return false;$/)) onclick += " return false;";
    className = removeClassDot(className);

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

  //
  // lookup and set

  function lookup (coll, key) {

    //clog([ "lu", key, coll ]);

    if (coll === undefined) return undefined;
    if (key === undefined) return undefined;

    if ( ! $.isArray(key)) key = key.split('.');
    if (key.length < 1) return coll;

    return lookup(coll[key.shift()], key);
  }

  function set (coll, key, value) {

    //clog([ "set", hash, key, value ]);

    if ( ! $.isArray(key)) key = key.split('.');

    var k = key.shift();

    if (key.length === 0) {
      coll[k] = value;
      return;
    }

    var scoll = coll[k];

    if (
      scoll === undefined &&
      ($.isArray(coll) || ((typeof coll) === 'object'))
    ) {
      var o = (key[0] && key[0].match(/^\d+$/)) ? [] : {};
      coll[k] = o;
      scoll = coll[k];
    }

    set(scoll, key, value);
  }

  //
  // parsing

  function parseAttributes (s) {

    // id "text" value [ values ] "title"

    var atts = {};
    var m;

    // id

    if ((typeof s) !== 'string') return atts;

    m = s.match(/^([^ "]+) ?(.+)?$/)

    if (m && m[1]) {
      atts.id = m[1];
      s = m[2] || '';
    }

    // "text"

    if ((typeof s) !== 'string') return atts;

    m = s.match(/^"([^"]+)" ?(.+)?$/)

    if (m && m[1]) {
      atts.text = m[1];
      s = m[2] || '';
    }

    // values

    m = s.match(/^(\[.+\]) ?(.+)?$/)

    if (m && m[1]) {
      var vs = m[1].slice(1, -1).split(',');
      var values = [];
      for (var i = 0; i < vs.length; i++) { values.push($.trim(vs[i])); }
      atts.values = values.length === 1 ? values[0] : values;
      s = m[2] || '';
    }

    // title

    m = s.match(/^"([^"]+)"$/)

    if (m) atts.title = m[1];

    return atts;
  }

  function parse (s) {

    var lines = s.split('\n');

    var current;
    var clevel = -1;

    for (var i = 0; i < lines.length; i++) {

      var line = lines[i];
      var tline = $.trim(line);

      if (tline == '') continue;
      if (tline.match(/^\/\//)) continue; // // comment line
      if (tline.match(/^#/)) continue; // # comment line

      var m = line.match(/^([ ]*)([^ ]+) ?(.+)?$/)
      var nlevel = m[1].length / 2;

      var elt = [ m[2], parseAttributes(m[3]), [] ];

      if (nlevel > clevel) {
        elt.parent = current;
      }
      else if (nlevel == clevel) {
        elt.parent = current.parent;
      }
      else /* nlevel < clevel */ {
        for (var j = 0; j <= clevel - nlevel; j++) {
          current = current.parent;
        }
        elt.parent = current;
      }
      if (elt.parent) elt.parent[2].push(elt);
      current = elt;
      clevel = nlevel;
    }

    // get back to 'root'
    while (current.parent) { current = current.parent; }

    return current;
  }

  //
  // rendering and producing

  var renderers = {};
  var hooks = {};

  renderers.render_ = function (container, template, data, options) {
    create(container, 'span', {}, JSON.stringify(template));
  }

  function renderChildren (container, template, data, options) {
    for (var i = 0; i < template[2].length; i++) {
      renderElement(container, template[2][i], data, options);
    }
  }

  renderers.produce_ = function (container, data) {
    var type = eltHidden(container, '.quad_type');
    if ( ! data._quad_produce_failures) data._quad_produce_failures = [];
    data._quad_produce_failures.push("can't deal with '" + type + "'");
  }

  function produceChildren (container, data) {
    $(container).children('.quad_element').each(function (i, e) {
      produceElement(e, data, i);
    });
  }

  renderers.produce__array = function (container, data) {

    produceChildren(container, data);

    // truncate array to desired length if necessary

    var a = lookup(data, currentId(container));
    var targetLength = $(container).children('.quad_element').length;

    while (a.length > targetLength) { a.pop(); }
  }

  //
  // select

  renderers.render_select = function (container, template, data, options) {

    var id = template[1].id;
    var label = template[1].text || id;

    create(container, 'span', '.quad_key', label);

    var select = create(container, 'select', '.quad_value');

    var value = id ? lookup(data, id) : undefined;
    var values = template[1].values;

    if ( ! $.isArray(values)) values = lookup(data, values);

    for (var i = 0; i < values.length; i++) {
      var opt = create(select, 'option', null, values[i]);
      if (values[i] === value) $(opt).attr('selected', 'selected');
    }
  }

  renderers.produce_select = function (container, data) {

    var sel = $(container).children('.quad_value')[0];
    set(data, currentId(container), sel.value);
  }

  //
  // checkbox

  renderers.render_checkbox = function (container, template, data, options) {

    var id = template[1].id;
    var label = template[1].text || id;

    var checkbox = create(
      container, 'input', { 'class': 'quad_checkbox', 'type': 'checkbox' });

    if (id) {

      var cid = currentId(container);

      checkbox.id = 'quad__' + cid.replace(/[\.]/, '_', 'g');
        // for webrat / capybara

      var value = lookup(data, cid) || '';
    }

    if (value === true) $(checkbox).attr('checked', 'checked');
    if (options.mode === 'view') $(checkbox).attr('disabled', 'disabled');

    create(container, 'span', '.quad_checkbox_key', label);
    //create(container, 'span', '.quad_text', label);
  }

  renderers.produce_checkbox = function (container, data) {

    var cb = $(container).children('.quad_checkbox')[0];
    set(data, currentId(container), $(cb).attr('checked'));
  }

  //
  // text_input

  renderers.render_text_input = function (container, template, data, options) {

    var id = template[1].id;
    var text = template[1].text || id;

    create(container, 'span', '.quad_key', text);

    var input = create(
      container, 'input', { 'class': 'quad_value', 'type': 'text' });

    if (id) {

      var cid = currentId(container);

      input.id = 'quad__' + cid.replace(/[\.]/, '_', 'g');
        // for webrat / capybara

      input.value = lookup(data, cid) || '';
    }

    if (options.mode === 'view') input.attr('disabled', 'disabled');
  }

  renderers.produce_text_input = function (container, data) {
    var id = currentId(container);
    var value = eltHidden(container, '.quad_value');
    set(data, id, value);
  }

  //
  // text

  renderers.render_text = function (container, template, data, options) {

    var text = template[1].text || '';

    if (template[1].id) {
      var id = currentId(container);
      text = lookup(data, id);
    }

    create(container, 'div', '.quad_key.quad_text', text);
  }

  renderers.produce_text = function (container, data) {
    // nothing to do
  }

  //
  // box

  renderers.render_box = function (container, template, data, options) {

    $(container).addClass('quad_box');

    renderChildren(container, template, data, options);
  }

  renderers.produce_box = function (container, data) {
    produceChildren(container, data);
  }

  //
  // group

  renderers.render_group = function (container, template, data, options) {

    renderChildren(container, template, data, options);
  }

  renderers.produce_group = function (container, data) {
    produceChildren(container, data);
  }

  //
  // tabs

  renderers.render_tab = function (container, template, data, options) {
    renderChildren(container, template, data, options);
  }

  renderers.render_tab_label = function (container, template, data, options) {

    var td = create(container, 'td', {});

    var label = template[1].text || template[1].id;

    var a = $(create(td, 'a', '.quad_tab', label));
    a.attr('href', '');
    a.attr('onclick', 'return Quaderno.hooks.showTab(this.parentNode);');

    return td;
  }

  renderers.render_tabs = function (container, template, data, options) {

    var tabs = template[2];
    var table = create(container, 'table', '.quad_tab_group');

    // tabs

    var tr0 = create(table, 'tr', '.quad_tab_group');

    for (var i = 0; i < tabs.length; i++) {
      renderers.render_tab_label(tr0, tabs[i], data, options);
    }

    var tab = $(tr0).find('td > .quad_tab')[0];
    $(tab).addClass('quad_selected');

    // content

    var tr = create(table, 'tr', '.quad_tab_group');
    var td = create(tr, 'td', { 'colspan': tabs.length });
    var qtb = create(td, 'div', '.quad_tab_body');

    for (i = 0; i < tabs.length; i++) {
      var div = renderElement(qtb, tabs[i], data, options);
      if (i != 0) div.style.display = 'none';
    }

    return table;
  }

  function computeSiblingOffset (elt, sel) {
    var cs = $(elt.parentNode).children(sel);
    for (var i = 0; i < cs.length; i++) {
      if (cs[i] == elt) return i;
    }
    return -1;
  }
  function findTabBody (elt) {
    var td = $(elt).parents('td')[0];
    var index = computeSiblingOffset(td);
    var table = $(elt).parents('table')[0];
    var tr = $(table).children('tr')[1];
    return $(tr).find('td > .quad_tab_body > .quad_element')[index];
  }

  function showTab (td) {

    for (var i = 0; i < td.parentNode.children.length; i++) {
      var tab = $(td.parentNode.children[i]).children('.quad_tab');
      tab.removeClass('quad_selected');
    }
    var tab = $(td).children('.quad_tab');
    tab.addClass('quad_selected');

    var tab_body = findTabBody(tab);

    for (var i = 0; i < tab_body.parentNode.children.length; i++) {
      tab_body.parentNode.children[i].style.display = 'none';
    }
    tab_body.style.display = 'block';

    return false; // no further HTTP request...
  }
  hooks.showTab = showTab;

  renderers.produce_tabs = function (elt, data) {
    var body = $(elt).find('.quad_tab_body')[0];
    produceChildren(body, data);
  }
  renderers.produce_tab = function (elt, data) {
    produceChildren(elt, data);
  }

  //
  // array hooks

  hooks.addToArray = function (elt) {

    //stack(elt);
      // TODO implement me !!

    var t = JSON.parse(eltHidden(elt.parentNode, '.quad_array_template'));
    t[1].id = '.0';

    var r = root(elt);

    renderElement(elt.parentNode, t, r.data, r.options);
    elt.parentNode.insertBefore(elt.nextSibling, elt);
  }

  hooks.removeFromArray = function (elt) {

    //stack(elt);
      // TODO implement me !!

    $(elt.parentNode).remove();
  }

  hooks.moveInArray = function (elt, direction) {

    //stack(elt);
      // TODO implement me !!

    elt = elt.parentNode;

    if (direction === 'up') {
      if (elt.previousSibling) {
        elt.parentNode.insertBefore(elt, elt.previousSibling);
      }
    }
    else if (elt.nextSibling) {
      elt.parentNode.insertBefore(elt.nextSibling, elt);
    }
  }

  //
  // render and produce, surface methods

  function root (elt) {
    return $(elt).parents('.quad_root')[0];
  }

  function eltHidden (elt, cname) {
    return $(elt).children(cname)[0].value;
  }

  function localId (elt) {
    var e = $(elt).children('.quad_id')[0];
    if ( ! e) return undefined;
    return $(e).attr('value');
  }

  function parentId (elt) {
    return elt.parentNode ? localId(elt.parentNode) : undefined;
  }

  function currentId (elt) {

    var id = localId(elt);

    if ( ! id) {
      if (elt.parentNode) return currentId(elt.parentNode);
      return undefined;
    }

    if (id[0] === '.' && elt.parentNode) {
      if (id === '.0') id = '.' + computeSiblingOffset(elt, '.quad_element');
      return currentId(elt.parentNode) + id;
    }

    return id;
  }

  function toElement (x) {

    if ((typeof x) !== 'string') return x;

    if (x.match(/^#/)) x = x.slice(1);
    return document.getElementById(x);
  }

  function extractArrayId (div, template) {

    var id = template[1].id;
    if ( ! id) return undefined;

    var m = id.match(/(.+\.)([*+-])?(\^)?$/);
    if ( ! m) return undefined;

    var h = {};
    h.id = m[1];
    h.slicedId = m[1].slice(0, -1);
    h.canAdd = (m[2] == '*' || m[2] == '+');
    h.canRemove = (m[2] == '*' || m[2] == '-');
    h.canReorder = (m[3] != undefined);

    return h;
  }

  function renderElement (container, template, data, options) {

    var func = renderers['render_' + template[0]] || renderers['render_'];

    var div = create(container, 'div', '.quad_element');

    var arrayId = extractArrayId(container, template);

    if (arrayId) {
      //
      // array

      hide(div, '.quad_id', arrayId.slicedId);
      hide(div, '.quad_type', '_array');
      hide(div, '.quad_array_template', JSON.stringify(template));

      var a = lookup(data, currentId(div));

      if (a) {
        for (var i = 0; i < a.length; i++) {

          template[1].id = '.0';
          var e = renderElement(div, template, data, options);

          if (arrayId.canRemove) {
            var b = button(
              e,
              '.quad_minus_button',
              'Quaderno.hooks.removeFromArray(this);');
            $(b).addClass('array_remove_button');
          }
          if (arrayId.canReorder) {
            var up = button(
              e,
              '.quad_up_button',
              'Quaderno.hooks.moveInArray(this, "up");');
            var down = button(
              e,
              '.quad_down_button',
              'Quaderno.hooks.moveInArray(this, "down");');
            $(up).addClass('array_move_button');
            $(down).addClass('array_move_button');
          }
        }
      }
      if (arrayId.canAdd) {
        button(
          div,
          '.quad_plus_button',
          'Quaderno.hooks.addToArray(this);');
      }

      return div;
    }

    // vanilla stuff, no repetition

    var id = template[1].id;

    if (id) hide(div, '.quad_id', id);

    if (template[1].title) $(div).attr('title', template[1].title);
    hide(div, '.quad_type', template[0]);

    func(div, template, data, options);

    return div;
  }

  function produceElement (container, data) {

    var type = eltHidden(container, '.quad_type');
    var func = renderers['produce_' + type] || renderers['produce_'];

    func(container, data);
  }

  function render (container, template, data, options) {

    container = toElement(container);

    while (container.firstChild) container.removeChild(container.firstChild);

    if ((typeof template) === 'string') template = parse(template);
    renderElement(container, template, data, options);

    container.data = data;
    container.options = options;
  }

  function produce (container, data) {

    container = toElement(container);

    data = data || container.data;

    var root = $(container).children('.quad_element')[0]
    produceElement(root, data, 0);

    return data;
  }

  return {

    // only for testing
    //
    _lookup: lookup,
    _set: set,

    // The hash of all the rendering functions, ready for insertion of new
    // render_x functions or for overriding existing render_y functions
    //
    renderers: renderers,

    // A hash for 'hooks', like for example, the showTab function.
    //
    hooks: hooks,

    parse: parse,
    render: render,
    produce: produce
  }
}();

