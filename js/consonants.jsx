import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import CharSection from './char-section.jsx'
import CharSubsection from './char-subsection.jsx'
import CharList from './char-list.jsx'
import { Char, Icon } from './svg-symbol.jsx'
import { toggleSetting } from './state-container/actions.js'
import consonants from './models/01-dico-consonants.json'
import toneMarks from './models/02-dico-tone-marks.json'

////////
// CUSTOM TITLE
////////

const ConsonantTitlePresentational = ({onClick, isActive}) => {
  const btnClass = `char-section__help-button ${ isActive ? 'char-section__help-button--active' : '' }`
  return (
    <Fragment>
      consonants
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

export default function Consonants( props ) {
  // const { toggleConsonantsHelp } = props
  return (
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
}
