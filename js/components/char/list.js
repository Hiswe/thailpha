import React, { forwardRef } from 'react'
import posed from 'react-pose'

import CharItem from '~/components/char/item'

const CharList = forwardRef((props, ref) => (
  <ul ref={ref} className="char-section__list">
    {props.chars.map(char => (
      <CharItem key={char.id} {...char} />
    ))}
  </ul>
))

const PosedCharList = posed(CharList)({
  enter: { staggerChildren: 30 },
  exit: { staggerChildren: 10, staggerDirection: -1 },
})

export default props => <PosedCharList {...props} />
