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

var getById    = function getById(id) {
  var result = consonants.filter(function (consonant) {
    return consonant.id === id;
  });
  return result[0];
};

module.exports = {
  getAll:   getAll,
  getById:  getById,
};
