import React, { Fragment, PureComponent } from 'react'
import classNames from 'classnames'

import CharSection from '~/components/char/section'
import CharSubsection from '~/components/char/subsection'
import CharList from '~/components/char/list'
import SvgChar from '~/components/svg/char'
import SvgIcon from '~/components/svg/icon'

import consonants from '~/models/01-dico-consonants.json'
import toneMarks from '~/models/02-dico-tone-marks.json'

////////
// CUSTOM TITLE
////////

const ConsonantTitle = props => {
  const { openHelp, isHelpOpen } = props
  const btnClass = classNames(`char-section__help-button`, {
    'char-section__help-button--active': isHelpOpen,
  })
  return (
    <Fragment>
      consonants
      <button className={btnClass} onClick={openHelp}>
        <SvgIcon svgId="help-outline" />
      </button>
    </Fragment>
  )
}

////////
// CONSONANT EXPLANATION
////////

const ConsonantExplanation = props => {
  const { closeHelp, isHelpOpen } = props
  if (!isHelpOpen) return null
  return (
    <div className="consonant-explanation" onClick={closeHelp}>
      <SvgIcon svgId="close" additionalClass="consonant-explanation__close" />
      <SvgChar
        svgId="consonant-explanation"
        additionalClass="consonant-explanation__content"
      />
    </div>
  )
}

////////
// CONSONANT PAGE
////////

export default class Consonants extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isHelpOpen: false,
    }
    this.openHelp = this.openHelp.bind(this)
    this.closeHelp = this.closeHelp.bind(this)
  }

  openHelp() {
    this.setState(() => ({
      isHelpOpen: true,
    }))
  }

  closeHelp() {
    this.setState(() => ({
      isHelpOpen: false,
    }))
  }

  render() {
    const { state } = this
    const { isHelpOpen } = state
    return (
      <Fragment>
        <CharSection
          title={
            <ConsonantTitle isHelpOpen={isHelpOpen} openHelp={this.openHelp} />
          }
        >
          <CharList chars={consonants} />
          <CharSubsection title="Tone marks">
            <CharList chars={toneMarks} />
          </CharSubsection>
        </CharSection>
        <ConsonantExplanation
          isHelpOpen={isHelpOpen}
          closeHelp={this.closeHelp}
        />
      </Fragment>
    )
  }
}
