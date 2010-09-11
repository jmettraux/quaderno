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

  // TODO : replace me with $.trim() as soon as the fake DOM is ready
  //
  function trim (s) { return s.replace(/^\s+|\s+$/g, ''); }

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
      var tline = trim(line);

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
  // rendering

  function use_ (container, template, data, options) {
    create(container, 'span', {}, JSON.stringify(template));
  }

  function renderChildren (container, template, data, options) {
    for (var i = 0; i < template[2].length; i++) {
      renderElement(container, template[2][i], data, options);
    }
  }

  //
  // selection

  //
  // checkbox

  function use_checkbox (container, template, data, options) {

    //var value = getValue(template, data, options);
    //value = value || {};
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
  // text

  function use_text (container, template, data, options) {

    var text = template[1].text || template[1].id;

    create(container, 'div', '.quad_key.quad_text', text);
  }

  //
  // group

  function use_group (container, template, data, options) {

    // TODO repeatable
    // TODO reorderable

    $(container).addClass('quad_group');

    renderChildren(container, template, data, options);
  }

  //
  // tabs

  function use_tab (container, template, data, options) {
    renderChildren(container, template, data, options);
  }

  function use_tab_label (container, template, data, options) {

    var td = create(container, 'td', {});

    var label = template[1].text || template[1].id;

    var a = $(create(td, 'a', '.quad_tab', label));
    a.attr('href', '');
    a.attr('onclick', 'Quaderno.showTab(this.parentNode); return false;');

    return td;
  }

  function use_tabs (container, template, data, options) {

    var tabs = template[2];
    var table = create(container, 'table', '.quad_tab_group');

    // tabs

    var tr0 = create(table, 'tr', '.quad_tab_group');

    for (var i = 0; i < tabs.length; i++) {
      use_tab_label(tr0, tabs[i], data, options);
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
  }

  //
  // rendering

  function toElement (x) {
    if ((typeof x) !== 'string') return x;
    if ( ! (x.match(/^#/))) x = '#' + x;
    return $(x)[0];
  }

  function renderElement (container, template, data, options) {

    var prefix = options.mode === 'view' ? 'view_' : 'use_';

    var func = eval(prefix);
    try { func = eval(prefix + template[0]); }
    catch (ex) {}

    var div = create(container, 'div', '.quad_element');

    var id = template[1].id;
    if (id) hide(div, '.quad_id', id);
    if (template[1].title) $(div).attr('title', template[1].title);
    hide(div, '.quad_type', template[0]);

    //hide(div, '.quad_template', JSON.stringify(template));
      // maybe a bit heavy

    func(div, template, data, options);

    return div;
  }

  function render (container, template, data, options) {
    container = toElement(container);
    renderElement(container, template, data, options);
  }

  return {

    showTab: showTab,

    parse: parse,
    render: render
  }
}();

