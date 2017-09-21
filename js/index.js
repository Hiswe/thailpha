'use strict';

// require('fastclick')(document.body);
require('viewport-units-buggyfill').init();

// Velocity will expose itself globally :(
require('velocity-animate');
require('velocity-animate/velocity.ui');

// Pub sub to handle global events (popover)
var m                 = require('mithril');
var PubSub            = require('pubsub-js');
var iNoBounce         = require('inobounce');
var isScrollSuported  = iNoBounce.isEnabled();
var html              = document.documentElement

const FIXED_CLASS     = 'is-html-fixed'

iNoBounce.disable();

PubSub.subscribe('popover', function (msg, isOpen) {
  if (isOpen) {
    if (isScrollSuported) iNoBounce.enable();
    return html.classList.add( FIXED_CLASS )
  }
  if (isScrollSuported) iNoBounce.disable();
  html.classList.remove( FIXED_CLASS )
});

m.route( document.getElementById('main'), '/', {
  '/':                  require('./modules/home'),
  '/settings':          require('./modules/settings'),
});
