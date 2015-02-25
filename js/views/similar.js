'use strict';

var m           = require('mithril');

var nav         = require('./nav.js');

module.exports = function (ctrl) {
  return [
    m('header', [
      m('h1.h1', [
        'Similar to ',
        m('span.thai-letter', ctrl.char.letter),
      ]),
    ]),
    m('table', [
      ctrl.similars.map(function(similar) {
        return m('tr', [
          m('td.thai-letter', similar.letter),
          m('td', similar.rtgs),
          m('td', similar.pronunciation.initial),
          m('td', similar.pronunciation.final),
        ]);
      })
    ]),
    nav('/letter/' + ctrl.char.id),
  ];
};
