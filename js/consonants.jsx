import React from 'react'
import { connect } from 'react-redux'

import CharSection from './char-section.jsx'
import CharList from './char-list.jsx'

const Consonnants = ({chars}) => (
  <CharSection title="consonnants">
    <CharList chars={ chars } />
  </CharSection>
)

const mapStateToProp = state => {
  return { chars: state.chars.filter( char => char.isConsonant )  }
}

const ConsonnantsContainer = connect( mapStateToProp )( Consonnants )

export { ConsonnantsContainer as default }
