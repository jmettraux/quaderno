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

var Jagaimo = function () {

  function create (container, tagName, className, innerText) {

    var e = document.createElement(tagName);

    if (className) {
      e.className = className;
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

  function isArray (o) {
    try { return o.constructor.toString().match(/function Array\(/); }
    catch (e) { return false; }
  }

  function renderAtom (container, a) {
    create(
      container,
      'span',
      'jagaimo_atom jagaimo_' + (typeof a),
      JSON.stringify(a));
  }

  function doRender (container, o) {

    if (isArray(o)) {

      create(container, 'span', 'jagaimo_bracket', '[');
      for (var i = 0; i < o.length; i++) {
        doRender(container, o[i]);
        if (i < o.length - 1) {
          create(container, 'span', 'jagaimo_comma', ',');
        }
      }
      create(container, 'span', 'jagaimo_bracket', ']');
    }
    else if ((typeof o) === 'object') {

      create(container, 'span', 'jagaimo_brace', '{');

      var keys = [];
      for (var k in o) keys.push(k);

      for (var i = 0; i < keys.length; i++) {
        create(container, 'span', 'jagaimo_key', keys[i]);
        create(container, 'span', 'jagaimo_colon', ':');
        doRender(container, o[keys[i]]);
        if (i < keys.length - 1) {
          create(container, 'span', 'jagaimo_comma', ',');
        }
      }
      create(container, 'span', 'jagaimo_brace', '}');
    }
    else {

      renderAtom(container, o);

    }
  }

  function render (containerId, o) {

    var container = containerId;

    if ((typeof containerId) === 'string') {
      if (containerId.match(/^#/)) containerId = containerId.slice(1);
      container = document.getElementById(containerId);
    }

    var fc; while (fc = container.firstChild) { container.removeChild(fc); }

    var jaga = create(container, 'div', '');

    doRender(jaga, o);

    var pre = create(container, 'pre', 'jagaimo_yama', Yama.toString(o));
    pre.style.display = 'none';

    container.onclick = function () {
      if (jaga.style.display === 'none') {
        jaga.style.display = 'block';
        pre.style.display = 'none';
      }
      else {
        jaga.style.display = 'none';
        pre.style.display = 'block';
      }
    };
    container.style.cursor = 'pointer';
  }

  return {

    // used by 'Yama'
    //
    _isArray: isArray,

    render: render
  };
}();


// Turns a javascript (JSON) thing into a string, with a nice indentation.
//
var Yama = function () {

  function indent (i) {
    var s = '';
    for (var j = 0; j < i; j++) { s = s + '  '; }
    return s;
  }

  function toString (o, ind) {

    ind = ind || 0;

    var s = '';

    if (Jagaimo._isArray(o)) {
      if (ind > 0) s = s + '\n';
      for (var i = 0; i < o.length; i++) {
        s = s + indent(ind) + '- ' + toString(o[i], ind + 1);
      }
    }
    else if ((typeof o) === 'object') {
      if (ind > 0) s = s + '\n';
      for (var k in o) {
        s = s + indent(ind) + k + ': ' + toString(o[k], ind + 1);
      }
    }
    else {
      s = s + o.toString() + '\n';
    }

    return s;
  }

  return {
    toString: toString
  };
}();

