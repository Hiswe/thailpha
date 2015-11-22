'use strict';

var m           = require('mithril');
var ls          = window.localStorage;

var STORAGE_ID  = 'thailpha-settings';

var settings    = ls.getItem(STORAGE_ID);

if (settings === 'undefined' || settings == null) {
  settings =  {
    showObsolete: true,
    showNumbers: true,
  };
} else {
  settings =  JSON.parse(settings);
};

module.exports = {
  get: function () {
    return settings;
  },
  put: function (data) {
    settings = data;
    ls.setItem(STORAGE_ID, JSON.stringify(data));
  }
}
