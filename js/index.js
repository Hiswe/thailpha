'use strict';

require('fastclick')(document.body);
require('viewport-units-buggyfill').init();

var m           = require('mithril');

var home  = {
  controller: require('./controllers/home.js'),
  view:       require('./views/home.js'),
};

var letter = {
  controller: require('./controllers/letter.js'),
  view:       require('./views/letter.js'),
};

m.route.mode = 'hash';

m.route(document.body, '/', {
  '/': home,
  '/letter/:letterId': letter
});
