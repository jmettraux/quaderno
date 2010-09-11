
var Quaderno = function () {

  //
  // misc

  function trim (s) { return s.replace(/^\s+|\s+$/g, ''); }

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

  function hide (container, classSel, value) {

    if (classSel[0] == '.') classSel = classSel.slice(1);

    return create(
      container,
      'input',
      { 'class': classSel, 'type': 'hidden', 'value': value });
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
        //clog("===");
        //clog("delta : " + (clevel - nlevel));
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
    clog(container);
    create(container, 'span', {}, JSON.stringify(template));
  }

  //
  // tabs

  function use_tab_label (container, template, data, options) {

    var td = create(container, 'td', {});

    hide(td, '.quad_label', template[1].label);
    var a = $(create(td, 'a', '.quad_tab', template[1].label));
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
      clog(tabs[i]);
      var div = renderElement(qtb, tabs[i], data, options);
      if (i != 0) div.style.display = 'none';
    }

    return table;
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

    func(container, template, data, options);
  }

  function render (container, template, data, options) {
    container = toElement(container);
    renderElement(container, template, data, options);
  }

  return {
    parse: parse,
    render: render
  }
}();

