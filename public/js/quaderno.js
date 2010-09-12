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

  // TODO : print() is a ffox function !!!! :-(
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

  function hide (container, cname, value) {
    if (cname[0] == '.') cname = cname.slice(1);
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

  function lookup (hash, key) {

    //clog([ "lu", key, hash ]);

    if (hash === undefined) return undefined;
    if (key === undefined) return undefined;

    if ( ! $.isArray(key)) key = key.split('.');
    if (key.length < 1) return hash;

    // TODO : when key is an array index

    return lookup(hash[key.shift()], key);
  }

  function set (hash, key, value) {
    var m = key.match(/(.+)\.([^\.]+)$/)
    if (m) {
      hash = lookup(hash, m[1]);
      key = m[2];
    }
    hash[key] = value;
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
      try {
        atts.values = JSON.parse(m[1]);
      } catch (e) {
      }
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
      if (tline.match(/^\/\//)) continue;

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

  renderers.produce_ = function (container, data, index) {
    var type = eltType(container);
    if ( ! data._quad_produce_failures) data._quad_produce_failures = [];
    data._quad_produce_failures.push("can't deal with '" + type + "'");
  }

  function produceChildren (container, data) {
    $(container).children('.quad_element').each(function (i, e) {
      produceElement(e, data, i);
    });
  }

  renderers.produce__array = function (container, data, index) {
    produceChildren(container, data);
  }

  //
  // selection

  // .. TODO

  //
  // checkbox

  renderers.render_checkbox = function (container, template, data, options) {

    var value = {};
    var text = value['text'];
    var checked = value['checked'];
    value = value['value'];

    var label = template[1].text || template[1].id;

    var checkbox = create(
      container,
      'input',
      { 'class': 'quad_checkbox',
        'type': 'checkbox',
        'value': value });
    if (checked) checkbox.attr('checked', 'checked');
    if (options.mode === 'view') setAttribute(checkbox, 'disabled', 'disabled');

    create(container, 'span', '.quad_checkbox_key', label);

    create(container, 'span', '.quad_text', text);
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

      input.id = 'quad__' + template[1].id.replace(/[\.]/, '_', 'g');
        // for webrat / capybara

      input.value = lookup(data, currentId(container)) || '';
    }

    if (options.mode === 'view') input.attr('disabled', 'disabled');
  }

  renderers.produce_text_input = function (container, data, index) {
    console.log(container);
    var id = currentId(container);
    var value = eltValue(container);
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

  //
  // group

  renderers.render_group = function (container, template, data, options) {

    renderChildren(container, template, data, options);
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

  function computeSiblingOffset (elt, count) {
    count = count || 0;
    if ( ! elt.previousSibling) return count;
    return computeSiblingOffset(elt.previousSibling, count + 1);
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

  renderers.produce_tabs = function (elt, data, index) {
    var body = $(elt).find('.quad_tab_body')[0];
    produceChildren(body, data);
  }
  renderers.produce_tab = function (elt, data, index) {
    produceChildren(elt, data);
  }

  //
  // render and produce, surface methods

  function eltType (elt) {
    return $(elt).children('.quad_type')[0].value;
  }
  function eltValue (elt) {
    return $(elt).children('.quad_value')[0].value;
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

    // TODO : recompute numerical ids, so that currentId may be used
    //        when rendering AND when producing

    var id = localId(elt);

    if ( ! id) {
      if (elt.parentNode) return currentId(elt.parentNode);
      return undefined;
    }

    if (id[0] === '.' && elt.parentNode) return currentId(elt.parentNode) + id;

    return id;
  }

  function toElement (x) {
    if ((typeof x) !== 'string') return x;
    if (x.match(/^#/)) x = x.slice(1);
    return document.getElementById(x);
  }

  function renderElement (container, template, data, options) {

    var func = renderers['render_' + template[0]] || renderers['render_'];

    var id = template[1].id;

    var div = create(container, 'div', '.quad_element');

    if (id && id.match(/\.$/)) {
      //
      // array

      hide(div, '.quad_id', id.slice(0, -1));
      hide(div, '.quad_type', '_array');

      var a = lookup(data, currentId(div));

      if (a) {
        for (var i = 0; i < a.length; i++) {
          template[1].id = '.' + i;
          renderElement(div, template, data, options);
        }
      }

      return div;
    }

    if (id) hide(div, '.quad_id', id);

    if (template[1].title) $(div).attr('title', template[1].title);
    hide(div, '.quad_type', template[0]);

    func(div, template, data, options);

    return div;
  }

  function produceElement (container, data, index) {

    var type = eltType(container);
    var func = renderers['produce_' + type] || renderers['produce_'];

    func(container, data, index);
  }

  function render (container, template, data, options) {

    container = toElement(container);

    while (container.firstChild) container.removeChild(container.firstChild);

    if ((typeof template) === 'string') template = parse(template);
    renderElement(container, template, data, options);

    container.data = data;
  }

  function produce (container, data) {

    container = toElement(container);

    data = data || container.data;

    var root = $(container).children('.quad_element')[0]
    produceElement(root, data, 0);

    return data;
  }

  return {

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

