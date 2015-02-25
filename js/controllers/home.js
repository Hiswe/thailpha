'use strict';

var m       = require('mithril');

var letters   = require('../models/letters.js');


module.exports = function () {

  var settings    = require('../models/settings.js').get();

  this.consonants = letters.getAll(settings.showObsolete);

  this.onClick    = function (e) {
    m.route('/letter/' + this.id);
  }
};
