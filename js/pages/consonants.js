import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import CharSection from '~/components/char/section'
import CharSubsection from '~/components/char/subsection'
import CharList from '~/components/char/list'
import SvgChar from '~/components/svg/char'
import SvgIcon from '~/components/svg/icon'

import { toggleSetting } from '~/state-container/actions.js'
import consonants from '~/models/01-dico-consonants.json'
import toneMarks from '~/models/02-dico-tone-marks.json'

////////
// CUSTOM TITLE
////////

const ConsonantTitlePresentational = ({ onClick, isActive }) => {
  const btnClass = classNames(`char-section__help-button`, {
    'char-section__help-button--active': isActive,
  })
  return (
    <Fragment>
      consonants
      <button className={btnClass} onClick={onClick}>
        <SvgIcon svgId="help-outline" />
      </button>
    </Fragment>
  )
}
const consonantTitleState2Prop = state => {
  return {
    isActive: state.settings.get('showConsonantsHelp'),
  }
}
const consonantTitleDispatch2Prop = {
  onClick(e) {
    return toggleSetting({
      key: 'showConsonantsHelp',
    })
  },
}
const ConsonantTitle = connect(
  consonantTitleState2Prop,
  consonantTitleDispatch2Prop
)(ConsonantTitlePresentational)

////////
// CONSONANT EXPLANATION
////////

const ConsonantExplanationPresentational = ({ isVisible, close }) => {
  if (!isVisible) return null
  return (
    <div className="consonant-explanation" onClick={close}>
      <SvgIcon svgId="close" additionalClass="consonant-explanation__close" />
      <SvgChar
        svgId="consonant-explanation"
        additionalClass="consonant-explanation__content"
      />
    </div>
  )
}

const consonantExplanationState2Prop = state => {
  return {
    isVisible: state.settings.get('showConsonantsHelp'),
  }
}
const consonantExplanationDispatch2Prop = {
  close(e) {
    return toggleSetting({
      key: 'showConsonantsHelp',
      value: false,
    })
  },
}
const ConsonantExplanation = connect(
  consonantExplanationState2Prop,
  consonantExplanationDispatch2Prop
)(ConsonantExplanationPresentational)

////////
// CONSONANT PAGE
////////

export default function Consonants(props) {
  // const { toggleConsonantsHelp } = props
  return (
    <Fragment>
      <CharSection title={<ConsonantTitle />}>
        <CharList chars={consonants} />
        <CharSubsection title="Tone marks">
          <CharList chars={toneMarks} />
        </CharSubsection>
      </CharSection>
      <ConsonantExplanation />
    </Fragment>
  )
}
