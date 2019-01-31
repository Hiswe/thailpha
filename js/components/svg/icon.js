import React from 'react'

const SvgIcon = ({ svgId, additionalClass = '' }) => {
  return (
    <svg role="img" className={`svg-icon icon-${svgId} ${additionalClass}`}>
      <use xlinkHref={`#icon-${svgId}`} />
    </svg>
  )
}

export default SvgIcon
