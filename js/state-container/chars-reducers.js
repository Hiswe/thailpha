import crio from 'crio'

import dictionary from '../models/dico-all.js'

const INITIAL_CHARS = crio( dictionary )
const chars = ( state = INITIAL_CHARS , action ) => {
  return state
}
const filtered = ( state = INITIAL_CHARS , action ) => {
  switch (action.type) {
    case 'FILTER_CHAR':
      const query = action.query.toLowerCase()
      if ( !query ) return INITIAL_CHARS
      // return state
      return INITIAL_CHARS.filter( char => {
        const { rtgs, meaning, letter, thai } = char
        const inRtgs = rtgs.toLowerCase().includes( query )
        const inMeaning = meaning && meaning.toLowerCase().includes( query )
        const isLetter = query === letter
        const inThai = thai.includes( query )
        return (inRtgs || inMeaning || isLetter || inThai)
      })
    default:
      return state
  }
}

export {
  chars,
  filtered,
}
