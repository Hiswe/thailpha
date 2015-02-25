'use strict';

var m           = require('mithril');

module.exports = function(ctrl) {
  return [
    m('h1.h1', 'consonants'),
    m('ul.preview-list', [
      ctrl.consonants.map(function (consonant) {
        return m('li.preview-list-item', {
          key:        consonant.id,
          'data-id':  consonant.id,
          onclick:    ctrl.onClick.bind(consonant),
        }, consonant.letter);
      })
    ]),
  ];
};
