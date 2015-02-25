'use strict';

var m           = require('mithril');

var letters     = require('../models/letters.js');

module.exports = function () {
  var id        = m.route.param('letterId');
  this.char     = letters.getById(id)[0];
  this.similars = letters.getById(this.char.similar);
};

