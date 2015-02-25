'use strict';

var m           = require('mithril');
var ls          = window.localStorage;

var STORAGE_ID  = 'thailpha-settings';

var settings    = ls.getItem(STORAGE_ID);

console.log(settings);

if (settings === 'undefined' || settings == null) {
  settings =  {
    showDeprecated: false
  };
} else {
  settings =  JSON.parse(settings);
};

console.log(settings);

module.exports = {
  get: function () {
    console.log('get', settings);
    return settings;
  },
  put: function (data) {
    settings = data;
    console.log('put', settings);
    ls.setItem(STORAGE_ID, JSON.stringify(data));
  }
}
