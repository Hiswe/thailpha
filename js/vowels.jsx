import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import CharSection from './char-section.jsx'
import CharSubsection from './char-subsection.jsx'
import CharList from './char-list.jsx'

const Vowels = ( chars ) => (
  <Fragment>
    <CharSection title="vowels">
      <CharSubsection title="short">
        <CharList chars={ chars.vowelsShorts } />
      </CharSubsection>
      <CharSubsection title="long">
        <CharList chars={ chars.vowelsLongs } />
      </CharSubsection>
    </CharSection>
    <CharSection title="diphtongs">
      <CharSubsection title="short">
        <CharList chars={ chars.diphtongsShorts } />
      </CharSubsection>
      <CharSubsection title="long">
        <CharList chars={ chars.diphtongsLongs } />
      </CharSubsection>
    </CharSection>
    <CharSection title="glides">
      <CharSubsection title="short">
        <CharList chars={ chars.glidesShorts } />
      </CharSubsection>
      <CharSubsection title="long">
        <CharList chars={ chars.glidesLongs } />
      </CharSubsection>
    </CharSection>
    <CharSection title="miscellanous">
        <CharList chars={ chars.miscellanous } />
    </CharSection>
  </Fragment>
)

const mapStateToProp = state => {
  return {
    vowelsShorts:     state.chars.filter( char => char.isVowel && char.isShort ),
    vowelsLongs:      state.chars.filter( char => char.isVowel && char.isLong ),
    diphtongsShorts:  state.chars.filter( char => char.isDiphtong && char.isShort ),
    diphtongsLongs:   state.chars.filter( char => char.isDiphtong && char.isLong ),
    glidesShorts:     state.chars.filter( char => char.isGlide && char.isShort ),
    glidesLongs:      state.chars.filter( char => char.isGlide && char.isLong ),
    miscellanous:     state.chars.filter( char => char.isMiscellanous ),
  }
}

const VowelsContainer = connect( mapStateToProp )( Vowels )

export { VowelsContainer as default }
