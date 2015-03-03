'use strict';

var m           = require('mithril');

var nav         = require('./nav.js');

module.exports = function(ctrl) {
  return [
    m('section#consonants.home-section', [
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
            m('p.thai-letter', {
              className: consonant.longId,
            }, consonant.letter),
            m('p.preview-list-item-rtgs', consonant.rtgs)
          ]);
        })
      ]),
    ]),
    m('section#vowels.home-section', [
      m('header', [
          m('h1.h1', 'vowels'),
        ]
      ),
      m('dl',[
        m('dt.h2', 'short'),
        m('dd', [
          m('ul.preview-list.preview-list-vowels', [
            ctrl.vowels.short.map(function (shortVowel) {
              return m('li.preview-list-item', {
                key:      shortVowel.id,
                onclick:  ctrl.onClick.bind(shortVowel),
              }, [
                m('p.thai-letter', shortVowel.letter),
                m('p.preview-list-item-rtgs', shortVowel.rtgs)
              ]);
            })
          ]),
        ]),
        m('dt.h2', 'long'),
        m('dd', [
          m('ul.preview-list.preview-list-vowels', [
            ctrl.vowels.long.map(function (longVowel) {
              return m('li.preview-list-item', {
                key:      longVowel.id,
                onclick:  ctrl.onClick.bind(longVowel),
              }, [
                m('p.thai-letter', longVowel.letter),
                m('p.preview-list-item-rtgs', longVowel.rtgs)
              ]);
            })
          ]),
        ]),
      ]),
    ]),
    m('section#numbers.home-section', [
      m('header', [
          m('h1.h1', 'numbers'),
        ]
      ),
      m('ul.preview-list', [
        ctrl.numbers.map(function (number) {
          return m('li.preview-list-item', {
            key:      number.id,
            // href:     '/letter/' + consonant.id,
            // config:   m.route
            onclick:    ctrl.onClick.bind(number),
          }, [
            m('p.thai-letter', {
              className: number.longId,
            }, number.letter),
            m('p.preview-list-item-rtgs', number.rtgs)
          ]);
        })
      ]),
    ]),
    nav(),
  ];
};
