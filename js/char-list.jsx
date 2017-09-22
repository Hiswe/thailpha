import React from 'react'

import CharItem from './char-item.jsx'

const CharList = props => (
  <ul className="char-section__list">
    { props.chars.map( char => <CharItem key={char.id} {...char} /> ) }
  </ul>
)

export { CharList as default }
