
import consonants  from './dico-consonants.js'
import shortVowels from './dico-short-vowels.js'
import longVowels  from './dico-long-vowels.js'
import numbers     from './dico-numbers.js'
import Settings    from './settings.js'

const allLetters  = [].concat(consonants, shortVowels, longVowels, numbers)
// const allLetters  = [...consonants, ...consonants, ...longVowels, ...numbers]

// console.log(allLetters)

const getConsonants = () => {
  const settings = Settings.get()
  if (settings.showObsolete === false) {
    return consonants.filter( consonant => consonant.obsolete !== true )
  }
  return consonants
}

const getVowels = () => {
  return {
    short() { return shortVowels },
    long()  { return longVowels },
  }
}

const getNumbers = () => numbers

const getByIds = query => {
  const settings  = Settings.get()
  const ids       = Array.isArray(query) ? query : [ query ]
  let result      = allLetters.filter( consonant => {
    return ids.indexOf(consonant.id) !== -1
  })

  // take care of obsolete letters
  if (settings.showObsolete === false) {
    result = result.filter( letter =>  letter.obsolete !== true )
  }

  if (result.length === 0) {
    console.warn('no letter found for', ids.join(' '));
    return result
  }

  if (result.length === 1) return result

  // sort by the query order
  return result.sort(  (a, b) => {
    const c = ids.indexOf(a.id)
    const d = ids.indexOf(b.id)
    // long version of compare as in mobile phone 'return c > d' doesn't work
    if (c < d) return -1
    if (c > d) return 1
    return 0
  })
}

const filterConsonants = query => {
  query = query.toLowerCase()
  return consonants.filter( consonant => {
    if (consonant.rtgs.indexOf(query) !== -1) return consonant
    if (consonant.meaning.indexOf(query) !== -1) return consonant
    return false
  })
}

export {
  getConsonants,
  getVowels,
  getNumbers,
  getByIds,
  filterConsonants,
}
