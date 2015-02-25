'use strict';

var consonants = require('./consonants.js');

var getAll    = function getAll(showObsolete) {
  if (showObsolete === false) {
    return consonants.filter(function (consonant) {
      return consonant.obsolete !== true;
    });
  }
  return consonants;
};

var getById    = function getById(ids) {
  ids = Array.isArray(ids) ? ids : [ids];

  var result = consonants.filter(function (consonant) {
    return ids.indexOf(consonant.id) !== -1;
  });

  return result;
};

module.exports = {
  getAll:   getAll,
  getById:  getById,
};
