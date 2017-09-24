import React from 'react'
import { connect } from 'react-redux'

import CharSection from './char-section.jsx'
import CharSubsection from './char-subsection.jsx'
import CharList from './char-list.jsx'

const Vowels = ({shorts, longs}) => (
  <CharSection title="vowels">
    <CharSubsection title="short">
      <CharList chars={ shorts } />
    </CharSubsection>
    <CharSubsection title="long">
      <CharList chars={ longs } />
    </CharSubsection>
  </CharSection>
)

const mapStateToProp = state => {
  return { 
    shorts: state.chars.filter( char => char.isShort ),
    longs:  state.chars.filter( char => char.isLong ),
  }
}

const VowelsContainer = connect( mapStateToProp )( Vowels )

export { VowelsContainer as default }
