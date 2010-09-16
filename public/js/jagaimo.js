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

  function determineType (o) {
    try {
      var con = o.constructor.toString();
      var m = con.match(/function ([^\(]+)/)
      return m[1];
    }
    catch (e) {
      return undefined;
    }
  }

  function renderAtom (container, a) {
    create(
      container,
      'span',
      'jagaimo_atom jagaimo_' + (typeof a),
      JSON.stringify(a));
  }

  function doRender (container, o) {

    var type = determineType(o);

    if (type === 'Array') {

      create(container, 'span', 'jagaimo_bracket', '[');
      for (var i = 0; i < o.length; i++) {
        doRender(container, o[i]);
        if (i < o.length - 1) {
          create(container, 'span', 'jagaimo_comma', ',');
        }
      }
      create(container, 'span', 'jagaimo_bracket', ']');

    }
    else if (type === 'Object') {

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

    doRender(container, o);
  }

  return {
    render: render
  };
}();

