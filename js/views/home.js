'use strict';

var m           = require('mithril');

module.exports = function(ctrl) {
  return [
    m('header', [
        m('h1.h1', 'consonants'),
        m('a.settings[href="/settings"]', {
          config: m.route
        }, '¤'),
      ]
    ),
    m('ul.preview-list', [
      ctrl.consonants.map(function (consonant) {
        return m('li.preview-list-item', {
          key:      consonant.id,
          // href:     '/letter/' + consonant.id,
          // config:   m.route
          onclick:    ctrl.onClick.bind(consonant),
        }, consonant.letter);
      })
    ]),
  ];
};
