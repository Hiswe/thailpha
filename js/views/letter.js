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

var pronunciation = function pronunciation(ctrl) {
  if (ctrl.char.pronunciation == null) {
    return '';
  }
  var pronunce = ctrl.char.pronunciation;
  if (typeof pronunce === 'string') {
    return  m('.letter-pronunciation', [
      m('span', pronunce),
    ]);
  }
  return m('.letter-pronunciation', [
    m('span.letter-pronunciation-label', 'start'),
    m('span', pronunce.initial),
    m('span.letter-pronunciation-label', 'final'),
    m('span', pronunce.final),
  ]);
};

var variant = function variant(ctrl) {
  if (ctrl.char.variant == null) {
    return '';
  }
  var altChar = ctrl.char.variant;
  return m('ul.letter-variant', altChar.map(function (alt) {
      return m('li.thai-letter', alt);
    })
  );
};

module.exports = function (ctrl) {
  return [
    m('.letter-container', {
      className: ctrl.char.isVowel ? 'is-vowel' : '',
    },[
      m('strong.thai-letter', {
        className: ctrl.char.longId,
      }, ctrl.char.letter),
      variant(ctrl),
      m('p.letter-meaning', [
        m('span.letter-meaning-thai', ctrl.char.thai),
        m('span.letter-meaning-rtgs', ctrl.char.rtgs),
      ]),
      pronunciation(ctrl),
      footer(ctrl),
    ]),
    nav('/'),
    similar(ctrl),
  ];
}
