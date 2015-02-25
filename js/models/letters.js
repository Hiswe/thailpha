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

var getByIds   = function getById(ids) {
  ids = Array.isArray(ids) ? ids : [ids];

  var result = consonants.filter(function (consonant) {
    return ids.indexOf(consonant.id) !== -1;
  });

  if (result.length === 1) {
    return result;
  }

  // sort by the query order
  result.sort(function (a, b) {
    return ids.indexOf(a.id) > ids.indexOf(b.id);
  });

  return result;
};

module.exports = {
  getAll:   getAll,
  getByIds: getByIds,
};
