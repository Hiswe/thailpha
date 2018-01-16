import { h } from 'preact'

const Char = ({svgId, additionalClass = ''}) => {
  return (
    <svg role="img" className={`svg-char char-${svgId} ${additionalClass}`}>
      <use xlinkHref={`/svg-chars.svg#char-${svgId }`}></use>
    </svg>
  )
}

const Icon = props => null

export {
  Char,
  Icon,
}
