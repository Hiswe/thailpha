'use strict';

var m           = require('mithril');

var Settings    = require('../models/settings.js');

module.exports = function () {
  var settings        =  Settings.get();

  this.showDeprecated =  m.prop(settings.showDeprecated);

  this.onSave         = function (e) {
    Settings.put({
      showDeprecated: this.showDeprecated()
    });
  };
};
