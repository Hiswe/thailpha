'use strict';

require('fastclick')(document.body);
require('viewport-units-buggyfill').init();

// Velocity will expose itself globally :(
require('velocity-animate');
require('velocity-animate/velocity.ui');

// Pub sub to handle global events (popover)
var m                 = require('mithril');
var $                 = require('dominus');
var PubSub            = require('pubsub-js');
var iNoBounce         = require('inobounce');
var isScrollSuported  = iNoBounce.isEnabled();
var $html             = $('html');

iNoBounce.disable();

PubSub.subscribe('popover', function (msg, isOpen) {
  if (isOpen) {
    if (isScrollSuported) iNoBounce.enable();
    return $('html').addClass('is-html-fixed');
  }
  if (isScrollSuported) iNoBounce.disable();
  $('html').removeClass('is-html-fixed');
});

m.route(document.getElementById('main'), '/', {
  '/':                  require('./modules/home'),
  '/settings':          require('./modules/settings'),
});
