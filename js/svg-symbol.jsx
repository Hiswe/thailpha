import React from 'react'

const Char = ({svgId, additionalClass = ''}) => {
  return (
    <svg role="img" className={`svg-char char-${svgId} ${additionalClass}`}>
      <use xlinkHref={`/svg-chars.svg#char-${svgId }`}></use>
    </svg>
  )
}

const Icon = ({svgId, additionalClass = ''}) => {
  return (
    <svg role="img" className={`svg-icon icon-${svgId} ${additionalClass}`}>
      <use xlinkHref={`#icon-${svgId }`}></use>
    </svg>
  )
}

export {
  Char,
  Icon,
}
