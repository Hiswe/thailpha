import crio from 'crio'

import dictionary from '../models/dico-all.js'

const INITIAL_CHARS = crio( dictionary )
const chars = ( state = INITIAL_CHARS , action ) => {
  return state
}
const getRelevanceForSearch = ( search, str = '', factor = 1 ) => {
  let myArray
  let occurences = 0
  while ((myArray = search.exec(str)) !== null) {
    occurences += 1
  }
  return occurences * factor
}
const filtered = ( state = INITIAL_CHARS , action ) => {
  switch (action.type) {
    case 'FILTER_CHAR':
      const query = action.query.toLowerCase()
      if ( !query ) return INITIAL_CHARS

      const searchResult = INITIAL_CHARS
        .reduce( (result, char) => {
          const { rtgs, meaning, letter, thai } = char
          let relevance         = 0
          const queryRegexp     = new RegExp( query, 'gi' )
          const isCompoundRtgs  = /^\w*\s\w$/i.test( rtgs )
          if ( isCompoundRtgs ) {
            const secondWord  = new RegExp( `\s${query}$`, 'gi')
            const firstWord   = new RegExp( `^${query}\s`, 'gi')
            relevance += getRelevanceForSearch( secondWord, rtgs, 4 )
            relevance += getRelevanceForSearch( firstWord, rtgs, 2 )
            relevance += getRelevanceForSearch( queryRegexp, rtgs, 1 )
          } else {
            const exactMatch = new RegExp( `^${query}$`, 'gi')
            relevance += getRelevanceForSearch( exactMatch, rtgs, 8 )
            relevance += getRelevanceForSearch( queryRegexp, rtgs, 2 )
          }
          relevance += getRelevanceForSearch( queryRegexp, meaning )
          relevance += getRelevanceForSearch( queryRegexp, letter, 3 )
          relevance += getRelevanceForSearch( queryRegexp, thai  )
          if (relevance > 0) result.push( [char, relevance] )
          return result
        }, [])
        .sort( (a, b) => a[1] < b[1] )
        .map( a => a[0])

      return searchResult

    default:
      return state
  }
}

export {
  chars,
  filtered,
}
