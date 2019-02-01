import React, { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import posed from 'react-pose'
import classNames from 'classnames'

import SvgChar from '~/components/svg/char'

const CharItem = forwardRef((props, ref) => {
  const wrapperClasses = classNames(`char-section__item`, {
    [`class-${props.class}`]: props.class,
    'is-obsolete': props.obsolete,
  })
  const letterClasses = classNames(`thai-letter`, props.longId, {
    'thai-letter--vowel': props.isVowel,
  })
  const charUrl = { pathname: `/char/${props.longId}` }
  if (__IS_DEV__) charUrl.search = `?id=${props.id}`

  return (
    <li className={wrapperClasses} ref={ref}>
      <Link to={charUrl} className="char-section__item-link">
        <p className="preview-list-item-rtgs">{props.rtgs}</p>
        <p className={letterClasses}>
          <SvgChar svgId={props.longId} />
        </p>
        <p className="preview-list-item-meaning">{props.meaning}</p>
      </Link>
    </li>
  )
})

const PosedCharItem = posed(CharItem)({
  enter: { y: 0, opacity: 1 },
  exit: { y: 25, opacity: 0 },
})

export default props => <PosedCharItem {...props} />
