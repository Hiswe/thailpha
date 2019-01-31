import React from 'react'

import CharSection from '~/components/char/section'
import CharList from '~/components/char/list'
import numbers from '~/models/10-dico-numbers.json'

export default function Numbers(props) {
  return (
    <CharSection title="numbers">
      <CharList chars={numbers} />
    </CharSection>
  )
}
