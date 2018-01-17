import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import CharSection from './char-section.jsx'
import CharSubsection from './char-subsection.jsx'
import CharList from './char-list.jsx'
import { Icon } from './svg-symbol.jsx'
import { toggleSetting } from './actions.js'

// const Consonants = ({consonants, toneMarks}) => (
//   <CharSection title="consonnants">
//     <CharList chars={ consonants } />
//     <CharSubsection title="Tone marks">
//       <CharList chars={ toneMarks } />
//     </CharSubsection>
//   </CharSection>
// )

const ConsonantTitle = () => {
  return (
    <Fragment>
      consonnants
      <Icon svgId="help-outline" />
    </Fragment>
  )
}


class ConsonantsSection extends Component {

  constructor( props ) {
    super( props )
  }

  render() {
    const {consonants, toneMarks} = this.props
    return (
      <CharSection title={ <ConsonantTitle /> }>
        <CharList chars={ consonants } />
        <CharSubsection title="Tone marks">
          <CharList chars={ toneMarks } />
        </CharSubsection>
      </CharSection>
    )
  }
}

const mapStateToProp = state => {
  return {
    consonants: state.chars.filter( char => char.isConsonant ),
    toneMarks: state.chars.filter( char => char.isToneMark ),
  }
}

const ConsonantsContainer = connect( mapStateToProp )( ConsonantsSection )

export { ConsonantsContainer as default }
