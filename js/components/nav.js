'use strict';

var m           = require('mithril');
var actualRoute = '';

var goBack      = function goBack() {
  history.back();
};

var backLink    = function backLink() {
  if (actualRoute === '/') {
    return [];
  }
  return m('a.top-nav-back', {
    onclick: goBack,
  }, '< back');
}

var settings    = function settings() {
  if (actualRoute === '/settings') {
    return [];
  }
  return m('a.top-nav-settings[href="/settings"]', {
    config: m.route
  }, 'settings');
}

var home      = function home(ctrl) {
  if (actualRoute === '/') {
    return m('input[type=text][placeholder=search]', {
      oninput: ctrl.onSearch.bind(ctrl)
    });
  }
  return m('a.top-nav-home', {
    href: ctrl.url,
    config: m.route,
  }, 'home');
}

module.exports = function (ctrl) {
  actualRoute = m.route();
  return [
    m('nav.top-nav', [
      backLink(),
      home(ctrl),
      settings(),
    ]),
  ];
}
