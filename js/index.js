'use strict';

require('fastclick')(document.body);
require('viewport-units-buggyfill').init();

// Velocity will expose itself globally :(
require('velocity-animate');
require('velocity-animate/velocity.ui');

// Pub sub to handle global events (popover)
var $           = require('dominus');
var PubSub      = require('pubsub-js');
var iNoBounce   = require('inobounce');

iNoBounce.disable();

var $html       = $('html');

PubSub.subscribe('popover', function (msg, isOpen) {
  if (isOpen) {
    $('html').addClass('is-html-fixed');
    return iNoBounce.enable();
  }
  $('html').removeClass('is-html-fixed')
  iNoBounce.disable();
});

var m           = require('mithril');

m.route(document.getElementById('main'), '/', {
  '/':                  require('./modules/home'),
  '/settings':          require('./modules/settings'),
  '/letter/:letterId':  require('./modules/letter'),
});
