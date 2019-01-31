import React from 'react'
import { Link } from 'react-router-dom'

import SvgChar from '~/components/svg-char'

const CharItem = props => {
  let wrapperClasses = `char-section__item`
  if (props.class) wrapperClasses = `${wrapperClasses} class-${props.class}`
  if (props.obsolete) wrapperClasses = `${wrapperClasses} is-obsolete`
  let letterClasses = `thai-letter ${props.longId}`
  if (props.isVowel) letterClasses = `${letterClasses} thai-letter--vowel`
  const charUrl = { pathname: `${__BASE_URL__}/char/${props.longId}` }
  if (__IS_DEV__) charUrl.search = `?id=${props.id}`

  return (
    <li className={wrapperClasses}>
      <Link to={charUrl} className="char-section__item-link">
        <p className="preview-list-item-rtgs">{props.rtgs}</p>
        <p className={letterClasses}>
          <SvgChar svgId={props.longId} />
        </p>
        <p className="preview-list-item-meaning">{props.meaning}</p>
      </Link>
    </li>
  )
}

export { CharItem as default }
