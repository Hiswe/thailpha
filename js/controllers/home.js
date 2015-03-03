'use strict';

var m       = require('mithril');

var letters   = require('../models/letters.js');


module.exports = function () {
  this.consonants = letters.getConsonants();
  this.vowels     = letters.getVowels();
  this.numbers    = letters.getNumbers();
  this.onClick    = function (e) {
    m.route('/letter/' + this.id);
  }
  this.onSearch   = function (e) {
    this.consonants = letters.filterConsonants(e.target.value);
  }
};
