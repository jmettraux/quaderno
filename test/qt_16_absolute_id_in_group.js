
file = arguments[0];
dir = file.split('/').slice(0, -1).join('/');
load(dir + '/base.js');


// 0

//var template =
//  [ 'group', { 'label': 'nada' }, [
//    [ 'text_input', { 'label': 'balance', 'id': 'balance' }, [] ]
//  ] ];
//
//document._clear();
//Quaderno.render('quad', template, {}, { 'mode': 'use' });
//
//var gbalance = document._path('div > div > div', 1);
//var balance = gbalance._path('div > input', 3)
//balance.value = '100';
////print(balance);
//
//assertEqual({ 'balance': '100' }, Quaderno.produce('quad'));

// 1

var template1 =
  [ 'tabs', {}, [
    [ 'group', { 'label': 'nada' }, [
      [ 'text_input', { 'label': 'balance', 'id': 'balance' }, [] ]
    ] ],
  ] ];

document._clear();
Quaderno.render('quad', template1, {}, { 'mode': 'use' });

var firsttab = document._path('div > div > table > tr > td', 1);
//print(firsttab);
var balance = firsttab._path('td > div > div > div > input', 3)
//print(balance);
balance.value = '100';

assertEqual({ 'balance': '100' }, Quaderno.produce('quad'));
