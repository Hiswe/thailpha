'use strict';

var m       = require('mithril');

var letters   = require('../../models/letters.js');

var homeController = function homeController() {
  this.consonants = letters.getConsonants();
  this.vowels     = letters.getVowels();
  this.numbers    = letters.getNumbers();
  this.vm         = homeController.vm.init({});
  this.onClick    = function (e) {
    this.vm.current(e.currentTarget.id);
  }.bind(this);
  this.onSearch   = function (e) {
    this.consonants = letters.filterConsonants(e.target.value);
  }
};

var letterGetterSetter = function () {
  var val = false;
  var letterProp = function letterProp() {
    if (arguments.length === 0) return val;
    var id = arguments[0];
    if (id === false ) return val = false;
    val = {
      char: letters.getByIds(id)[0],
    };
    val.hasSimilar = val.char.similar != null;
    val.similars   = val.hasSimilar ? letters.getByIds(val.char.similar) : [];
  };
  return letterProp;
};

homeController.vm = (function homeVm() {
  var vm = {
    current: letterGetterSetter(),
  };
  vm.init = function init(options) {
    vm.reset();
    return vm;
  };
  vm.reset = function reset() {
    vm.current(false);
  }
  return vm;
})();

module.exports = homeController;
