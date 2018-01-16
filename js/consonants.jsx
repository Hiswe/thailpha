import { h } from 'preact'
import { connect } from 'react-redux'

import CharSection from './char-section.jsx'
import CharSubsection from './char-subsection.jsx'
import CharList from './char-list.jsx'

const Consonants = ({consonants, toneMarks}) => (
  <CharSection title="consonnants">
    <CharList chars={ consonants } />
    <CharSubsection title="Tone marks">
      <CharList chars={ toneMarks } />
    </CharSubsection>
  </CharSection>
)

const mapStateToProp = state => {
  return {
    consonants: state.chars.filter( char => char.isConsonant ),
    toneMarks: state.chars.filter( char => char.isToneMark ),
  }
}

const ConsonantsContainer = connect( mapStateToProp )( Consonants )

export { ConsonantsContainer as default }
