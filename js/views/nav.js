'use strict';

var m           = require('mithril');

var goBack      = function goBack() {
  history.back();
};

var backLink    = function backLink(url) {
  if (url) {
    return m('a.top-nav-back', {
      onclick: goBack,
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

var home      = function home() {
  if (m.route() === '/') {
    return '';
  }
  return m('a.top-nav-home[href="/"]', {
    config: m.route,
  }, 'home');
}

module.exports = function (url, isSettings) {
  return [
    m('nav.top-nav', [
      backLink(url),
      home(),
      settings(isSettings),
    ]),
  ];
}
