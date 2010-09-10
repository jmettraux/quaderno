
file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');


// 0

var te0 =
  [ 'group', { 'id': 'annual_audit.more' }, [
    [ 'select',
      { 'title': 'Acceptable ?', 'id':'.acceptable', 'values': 'Yes, No', 'value': '' },
      [] ]
  ] ];
var data0 = { 'annual_audit': { 'more': { 'acceptable': 'Yes' } } };

assertEqual(
  { 'annual_audit': { 'more': { 'acceptable': 'Yes' } } },
  render_and_produce(te0, data0));

