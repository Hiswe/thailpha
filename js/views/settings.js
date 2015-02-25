'use strict';

var m           = require('mithril');

module.exports = function (ctrl) {
  return [
    m('a.back[href="/"]', {
      config: m.route
    }, '<'),
    m('header', [
      m('h1.h1', 'settings'),
    ]),
    m('form.main', [
      m('input#showDeprecated[type="checkbox"]', {
        onchange: m.withAttr('checked', ctrl.showDeprecated),
        checked: ctrl.showDeprecated(),
      }),
      m('label[for="showDeprecated"]', 'show deprecated letters'),
      m('p', m('button.btn', {
        onclick: ctrl.onSave.bind(ctrl)
      }, 'save'))
    ]),
    m('footer',
      [
        m('p', [
          m('span', m.trust('all information are provided by ')),
          m('a.link[href="http://en.wikipedia.org/wiki/Thai_alphabet"][target="_blank"]', 'wikipedia'),
        ]),
        m('p', [
          m('span', m.trust('any suggestions? ')),
          m('a.link[href="https://github.com/Hiswe/thailpha/issues"][target="_blank"]', 'send here'),
        ]),
      ]
    ),
  ];
};
