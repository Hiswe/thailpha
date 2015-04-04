'use strict';

var m           = require('mithril');

var pkg         = require('../../../package.json');
var nav         = require('../../components/nav.js');

module.exports = function (ctrl) {
  return [
    m('header', [
      m('h1.h1', 'settings'),
    ]),
    m('.main',
      m('form', [
        m('input#showObsolete[type="checkbox"]', {
          onchange: m.withAttr('checked', ctrl.showObsolete),
          checked: ctrl.showObsolete(),
        }),
        m('label[for="showObsolete"]', 'show obsolete letters'),
        m('p', m('button.btn', {
          onclick: ctrl.onSave.bind(ctrl)
        }, 'save'))
      ])
    ),
    m('footer',
      [
        m('p', [
          m('span', 'all information are provided by '),
          m('a.link[href="http://en.wikipedia.org/wiki/Thai_alphabet"][target="_blank"]', 'wikipedia'),
        ]),
        m('p', [
          m('span', 'any suggestions? '),
          m('a.link[href="https://github.com/Hiswe/thailpha/issues"][target="_blank"]', 'send here'),
        ]),
        m('p.version', [
          m('a[href="goo.gl/5sJrpQ"]', 'goo.gl/5sJrpQ'),
          m('span', ' version '),
          m('span', pkg.version),
        ]),
      ]
    ),
    nav('/', false),
  ];
};
