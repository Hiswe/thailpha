import React from 'react'

import CharSection from './char-section.jsx'
import CharList from './char-list.jsx'
import numbers from './models/10-dico-numbers.json'

export default function Numbers( props ) {
  return (
    <CharSection title="numbers">
      <CharList chars={ numbers } />
    </CharSection>
  )
}
