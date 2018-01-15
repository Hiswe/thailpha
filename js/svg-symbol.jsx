import { h } from 'preact'

const Char = ({svgId}) => (
  <svg role="img" class={`svg-char char-${svgId}`}>
    <use xlinkHref={`/svg-chars.svg#char-${svgId }`}></use>
  </svg>
)

const Icon = props => null

export {
  Char,
  Icon,
}
