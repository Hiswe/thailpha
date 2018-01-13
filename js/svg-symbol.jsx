import { h } from 'preact'

const Char = ({svgId}) => (
  <svg role="img" class={`svg-char ${svgId}`}>
    <use xlinkHref={`/svg-Chars.svg#char-${svgId }`}></use>
  </svg>
)

const Icon = props => null

export {
  Char,
  Icon,
}
