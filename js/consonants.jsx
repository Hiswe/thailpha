import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import CharSection from './char-section.jsx'
import CharSubsection from './char-subsection.jsx'
import CharList from './char-list.jsx'
import { Char, Icon } from './svg-symbol.jsx'
import { toggleSetting } from './state-container/actions.js'

////////
// CUSTOM TITLE
////////

const ConsonantTitlePresentational = ({onClick, isActive}) => {
  const btnClass = `char-section__help-button ${ isActive ? 'char-section__help-button--active' : '' }`
  return (
    <Fragment>
      consonnants
      <button className={ btnClass } onClick={ onClick }>
        <Icon svgId="help-outline" />
      </button>
    </Fragment>
  )
}
const consonantTitleState2Prop = state => {
  return {
    isActive: state.settings.get( 'showConsonantsHelp' ),
  }
}
const consonantTitleDispatch2Prop = {
  onClick( e ) {
    return toggleSetting({
      key: 'showConsonantsHelp',
    })
  }
}
const ConsonantTitle = connect( consonantTitleState2Prop, consonantTitleDispatch2Prop )( ConsonantTitlePresentational )

////////
// CONSONANT EXPLANATION
////////

const ConsonantExplanationPresentational = ({isVisible, close}) => {
  if (!isVisible) return null
  return (
    <div className="consonant-explanation" onClick={ close }>
      <Icon svgId="close" additionalClass="consonant-explanation__close" />
      <Char svgId="consonant-explanation" additionalClass="consonant-explanation__content" />
    </div>
  )
}

const consonantExplanationState2Prop = state => {
  return {
    isVisible: state.settings.get( 'showConsonantsHelp' ),
  }
}
const consonantExplanationDispatch2Prop = {
  close( e ) {
    return toggleSetting({
      key:  'showConsonantsHelp',
      value: false,
    })
  }
}
const ConsonantExplanation = connect( consonantExplanationState2Prop, consonantExplanationDispatch2Prop )( ConsonantExplanationPresentational )

////////
// CONSONANT PAGE
////////

const ConsonantsPresentational = ({consonants, toneMarks, toggleConsonantsHelp}) => (
  <Fragment>
    <CharSection title={ <ConsonantTitle /> }>
      <CharList chars={ consonants } />
      <CharSubsection title="Tone marks">
        <CharList chars={ toneMarks } />
      </CharSubsection>
    </CharSection>
    <ConsonantExplanation />
  </Fragment>
)

const mapStateToProp = state => {
  return {
    consonants: state.chars.filter( char => char.isConsonant ),
    toneMarks: state.chars.filter( char => char.isToneMark ),
  }
}

const Consonants = connect( mapStateToProp )( ConsonantsPresentational )

export { Consonants as default }
