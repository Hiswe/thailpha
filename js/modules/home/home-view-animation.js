'use strict';

var m       = require('mithril');

// http://lhorie.github.io/mithril-blog/velocity-animations-in-mithril.html
var slideUp = function slideUp(callback) {
  return function () {
    m.redraw.strategy('none');
    m.startComputation();
    callback();
    setTimeout(function () {
      m.endComputation();
      // need a timeout for DOM to catch-up…
      Velocity(document.getElementById('settings'), 'transition.slideUpBigIn', 400);
    }, 1);
  }
};

var slideDown = function slideDown(callback) {
  return function (e) {
    e.preventDefault();
    m.redraw.strategy('none');
    Velocity(document.getElementById('settings'), 'transition.slideDownBigOut', {
      duration: 400,
      complete: function() {
        m.startComputation();
        callback();
        m.endComputation();
      }
    });
  };
};

var scrollUp = function scrollUp(element, isInitialized, context) {
  if (!isInitialized) return ;
  const container  = document.querySelector( '#letter' )
  const letter     = document.querySelector( '.letter-container' )
  Velocity( $content, 'scroll', { container } )
  letter.style.opacity = 0;
  Velocity(letter, {opacity: 1, delay: 200});
};

module.exports = {
  slideUp:    slideUp,
  slideDown:  slideDown,
  scrollUp:   scrollUp,
};
