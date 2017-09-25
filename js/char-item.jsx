import { h } from 'preact'
import { Link } from 'react-router-dom'

const CharItem = props => {
  let wrapperClasses  = `char-section__item`
  if ( props.class ) wrapperClasses = `${ wrapperClasses } class-${props.class}`
  let letterClasses   = `thai-letter ${props.longId}`
  if ( props.isVowel ) letterClasses = `${letterClasses} thai-letter--vowel`

  return (
    <li className={wrapperClasses}>
      <Link to={`/char/${props.longId}`} className="char-section__item-link" >
        <p className="preview-list-item-rtgs">{props.rtgs}</p>
        <p className={letterClasses}>{props.letter}</p>
        <p className="preview-list-item-meaning">{props.meaning}</p>
      </Link>
    </li>
  )
}

export { CharItem as default }
