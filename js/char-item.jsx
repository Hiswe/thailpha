import React from 'react'

const CharItem = props => {
  let wrapperClasses  = `char-section__item`
  if ( props.class ) wrapperClasses = `${ wrapperClasses } class-${props.class}`
  let letterClasses   = `thai-letter ${props.longId}`
  if ( props.isVowel ) letterClasses = `${letterClasses} thai-letter--vowel`

  return (
    <li className={wrapperClasses}>
      <p className="preview-list-item-rtgs">{props.rtgs}</p>
      <p className={letterClasses}>{props.letter}</p>
      <p className="preview-list-item-meaning">{props.meaning}</p>
    </li>
  )
}

export { CharItem as default }
