'use strict';

var m           = require('mithril');

var nav         = require('./nav.js');

var footer      = function footer(ctrl)  {
  if (ctrl.hasSimilar) {
    return m('p.letter-hint', '↓ similar ↓');
  }
  return '';
}

var similar = function similar(ctrl) {
  if (ctrl.hasSimilar) {
    return m('table', [
      ctrl.similars.map(function(similar) {
        return m('tr', [
          m('td.thai-letter', [
            m('a', {
              href: '/letter/' + similar.id,
              config: m.route
            }, similar.letter),
          ]),
          m('td', similar.rtgs),
          m('td', similar.pronunciation.initial),
          m('td', similar.pronunciation.final),
        ]);
      })
    ]);
  }
  return '';
}

module.exports = function (ctrl) {
  return [
    m('.letter-container', [
      m('strong.letter-thai.thai-letter', ctrl.char.letter),
      m('p.letter-meaning', [
        m('span.letter-meaning-thai', ctrl.char.thai),
        m('span.letter-meaning-rtgs', ctrl.char.rtgs),
      ]),
      m('.letter-pronunciation', [
        m('span.letter-pronunciation-label', 'start'),
        m('span', ctrl.char.pronunciation.initial),
        m('span.letter-pronunciation-label', 'final'),
        m('span', ctrl.char.pronunciation.final),
      ]),
      footer(ctrl),
    ]),
    nav('/'),
    similar(ctrl),
  ];
}
