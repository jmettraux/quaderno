
var Quaderno = function () {

  function

  function parse (s) {

    var lines = s.split('\n');

    var current = null;
    var clevel = -1;

    for (var i = 0; i < lines.length; i++) {

      var line = lines[i];
      var tline = $.trim(line);

      if (tline == '') continue;
      if (tline.match(/^\/\//)) continue;

      var m = line.match(/^([ ]*)([^ ]+) ?(.+)?$/)
      var nlevel = m[1].length / 2;

      var elt = [ m[2], m[3] || null, [] ];

      if (nlevel > clevel) {
        elt.parent = current;
      }
      else if (nlevel == clevel) {
        elt.parent = current.parent;
      }
      else /* nlevel < clevel */ {
        for (var j = 0; j < clevel - nlevel; j++) {
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

  return {
    parse: parse
  }
}();
