import React from 'react'

const SvgChar = ({ svgId, additionalClass = `` }) => {
  return (
    <svg role="img" className={`svg-char char-${svgId} ${additionalClass}`}>
      <use xlinkHref={`#char-${svgId}`} />
    </svg>
  )
}

export default SvgChar
