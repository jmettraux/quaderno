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

  function renderArray (container, a) {

    var span = create(container, 'span', 'jagaimo_element jagaimo_array');

    create(span, 'span', 'jagaimo_bracket', '[');

    for (var i = 0; i < a.length; i++) {
      doRender(span, a[i]);
      if (i < a.length - 1) create(span, 'span', 'jagaimo_comma', ',');
    }

    create(span, 'span', 'jagaimo_bracket', ']');

    return span;
  }

  function renderObject (container, o) {

    var span = create(container, 'span', 'jagaimo_element jagaimo_object');

    create(span, 'span', 'jagaimo_brace', '{');

    var lastComma;

    var keys = [];
    for (var k in o) { keys.push(k) };
    keys = keys.sort();

    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var skey = doRender(span, k);
      skey.className = skey.className + ' jagaimo_key';
      create(span, 'span', 'jagaimo_colon', ':');
      doRender(span, o[k]);
      lastComma = create(span, 'span', 'jagaimo_comma', ',');
    }
    if (lastComma) lastComma.parentNode.removeChild(lastComma);

    create(span, 'span', 'jagaimo_brace', '}');

    return span;
  }

  function doRender (container, o) {

    var type = o.constructor.name;

    if (type === 'String') {
      return create(
        container, 'span', 'jagaimo_element jagaimo_string', JSON.stringify(o));
    }
    if (type === 'Array') {
      return renderArray(container, o);
    }
    if (type === 'Object') {
      return renderObject(container, o);
    }
    return create(
      container, 'span', 'jagaimo_element jagaimo_other', JSON.stringify(o));
  }

  function render (containerId, o) {

    var container = containerId;

    if (containerId.constructor.name === 'String') {
      container = document.getElementById(containerId);
    }

    doRender(container, o);
  }

  return {
    render: render
  };
}();

