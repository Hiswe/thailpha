'use strict';

var m           = require('mithril');

var footer      = function footer(ctrl)  {
  if (!ctrl.char.similar) {
    return '';
  }
  return m('footer.footer-action', [
    m('a.btn-footer', {
      href: '/similar/' + ctrl.char.id,
      config: m.route
    }, 'similar'),
  ]);
}

module.exports = function (ctrl) {
  return [
    m('.main', [
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
    ]),
    footer(ctrl),
    m('a.back[href="/"]', {config: m.route}, '< back'),
  ];
}
