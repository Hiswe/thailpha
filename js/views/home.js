'use strict';

var m           = require('mithril');

var nav         = require('./nav.js');

module.exports = function(ctrl) {
  return [
    m('header', [
        m('h1.h1', 'consonants'),
      ]
    ),
    m('ul.preview-list', [
      ctrl.consonants.map(function (consonant) {
        return m('li.preview-list-item', {
          key:      consonant.id,
          // href:     '/letter/' + consonant.id,
          // config:   m.route
          onclick:    ctrl.onClick.bind(consonant),
        }, [
          m('p.thai-letter', consonant.letter),
          m('p.preview-list-item-rtgs', consonant.rtgs)
        ]);
      })
    ]),
    nav(),
  ];
};
