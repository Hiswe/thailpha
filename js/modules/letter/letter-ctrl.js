'use strict';

var m           = require('mithril');

var nav         = require('../../components/nav.js');

module.exports = function () {
  var id          = m.route.param('letterId');
  this.char       = letters.getByIds(id)[0];
  this.hasSimilar = this.char.similar != null;
  this.similars   = this.hasSimilar ? letters.getByIds(this.char.similar) : [];
};
