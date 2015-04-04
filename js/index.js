'use strict';

require('fastclick')(document.body);
require('viewport-units-buggyfill').init();

var m           = require('mithril');
m.route.mode    = 'hash';

m.route(document.getElementById('main'), '/', {
  '/':                  require('./modules/home'),
  '/settings':          require('./modules/settings'),
  '/letter/:letterId':  require('./modules/letter'),
});
