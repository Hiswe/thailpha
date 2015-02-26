'use strict';

var consonants  = require('./dico-consonants.js');
var Settings    = require('./settings.js');

var getAll    = function getAll() {
  var settings = Settings.get();
  if (settings.showObsolete === false) {
    return consonants.filter(function (consonant) {
      return consonant.obsolete !== true;
    });
  }
  return consonants;
};

var getByIds   = function getById(ids) {
  var settings = Settings.get();

  ids = Array.isArray(ids) ? ids : [ids];

  var result = consonants.filter(function (consonant) {
    return ids.indexOf(consonant.id) !== -1;
  });

  // take care of obsolete letters
  if (settings.showObsolete === false) {
    result = result.filter(function (letter) {
      return letter.obsolete !== true;
    })
  }

  if (result.length === 1) {
    return result;
  }

  // sort by the query order
  return result.sort(function (a, b) {
    return ids.indexOf(a.id) > ids.indexOf(b.id);
  });
};

module.exports = {
  getAll:   getAll,
  getByIds: getByIds,
};
