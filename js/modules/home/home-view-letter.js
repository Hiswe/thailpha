'use strict';

var m         = require('mithril');
var PubSub    = require('pubsub-js');

var animation = require('./home-view-animation');

var footer      = function footer(letter)  {
  if (letter.hasSimilar) {
    return m('p.letter-hint', '↓ similar ↓');
  }
  return '';
}

var similar = function similar(ctrl) {
  var letter = ctrl.vm.current();
  if (letter.hasSimilar) {
    return m('table', [
      letter.similars.map(function(similar) {
        return m('tr', [
          m('td.thai-letter', [
            m('a', {
              onclick: function () { ctrl.vm.current(similar.id); },
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

var pronunciation = function pronunciation(letter) {
  if (letter.char.pronunciation == null) {
    return '';
  }
  var pronunce = letter.char.pronunciation;
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

var variant = function variant(letter) {
  if (letter.char.variant == null) {
    return '';
  }
  var altChar = letter.char.variant;
  return m('ul.letter-variant', altChar.map(function (alt) {
      return m('li.thai-letter', alt);
    })
  );
};

module.exports = function (ctrl) {
  var letter    = ctrl.vm.current();
  var className = letter.char.isVowel ? 'is-vowel' : '';
  className     = letter.char.class ? `${className} class-${letter.char.class}` : className;
  return m('#letter', m('.content', {
    config: animation.scrollUp,
  }, [
    m('.letter-container', {
      className: className,
      onclick: function () {
        PubSub.publish('popover', false);
        ctrl.vm.reset();
      },
    },[
      m('strong.thai-letter', {
        className: letter.char.longId,
      // }, m('span', letter.char.letter)),
      }, letter.char.letter),
      variant(letter),
      m('p.letter-meaning', [
        m('span.letter-meaning-thai', letter.char.thai),
        m('span.letter-meaning-rtgs', letter.char.rtgs),
        m('span.letter-meaning-translation', letter.char.meaning),
      ]),
      pronunciation(letter),
      footer(letter),
    ]),
    similar(ctrl),
  ]));
};
