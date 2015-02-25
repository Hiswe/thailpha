'use strict';

var m           = require('mithril');

module.exports = function (ctrl) {
  return m('div.letter-container', [
    m('strong.letter-thai', ctrl.char.letter),
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
    m('a.back[href="/"]', {config: m.route}, '<'),
  ]);
}
