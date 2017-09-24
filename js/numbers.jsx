import React from 'react'
import { connect } from 'react-redux'

import CharSection from './char-section.jsx'
import CharList from './char-list.jsx'

const Numbers = ({chars}) => (
  <CharSection title="numbers">
    <CharList chars={ chars } />
  </CharSection>
)

const mapStateToProp = state => {
  return { chars: state.chars.filter( char => char.isNumber )  }
}

const NumbersContainer = connect( mapStateToProp )( Numbers )

export {
  NumbersContainer as default,
}
