'use strict';

var m           = require('mithril');

var Settings    = require('../../models/settings.js');

module.exports = function () {
  var settings        =  Settings.get();

  this.showObsolete   =  m.prop(settings.showObsolete);

  this.onSave         = function (e) {
    Settings.put({
      showObsolete: this.showObsolete()
    });
  };
};
