'use strict';

require('fastclick')(document.body);
require('viewport-units-buggyfill').init();

// Velocity will expose itself globally :(
require('velocity-animate');
require('velocity-animate/velocity.ui');

var m           = require('mithril');

m.route(document.getElementById('main'), '/', {
  '/':                  require('./modules/home'),
  '/settings':          require('./modules/settings'),
  '/letter/:letterId':  require('./modules/letter'),
});
