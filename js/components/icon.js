'use strict';

var m           = require('mithril');

module.exports = function Icon(name, moreClasses) {

  var className = 'icon icon-' + name;
  if (moreClasses) className = className + ' ' + moreClasses;

  return [
    m('svg', {
      className: className,
      role: 'img',
    }, [
      m('use', {
        'href': "#icon-" + name,
      })
    ]),
  ];
};

