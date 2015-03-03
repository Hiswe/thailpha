'use strict';

var m           = require('mithril');

var backLink    = function backLink(url) {
  if (url) {
    return m('a.top-nav-back', {
      href: 'javascript:history.back();',
    }, '< back');
  }
  return [];
}

var settings    = function settings(isSettings) {
  if (isSettings === false) {
    return [];
  }
  return m('a.top-nav-settings[href="/settings"]', {
    config: m.route
  }, 'settings');
}

module.exports = function (url, isSettings) {
  return [
    m('nav.top-nav', [
      backLink(url),
      settings(isSettings),
    ]),
  ];
}
