import React, { Fragment } from 'react'

import CharSection from './char-section.jsx'
import CharSubsection from './char-subsection.jsx'
import CharList from './char-list.jsx'

import vowelsShorts from './models/03-dico-short-vowels.json'
import vowelsLongs from './models/04-dico-long-vowels.json'
import diphtongsShorts from './models/05-dico-short-diphtongs.json'
import diphtongsLongs from './models/06-dico-long-diphtongs.json'
import glidesShorts from './models/07-dico-short-glides.json'
import glidesLongs from './models/08-dico-long-glides.json'
import miscellaneous from './models/09-dico-miscellaneous.json'

export default function Vowels( props ) {
  return (
    <Fragment>
      <CharSection title="vowels">
        <CharSubsection title="short">
          <CharList chars={ vowelsShorts } />
        </CharSubsection>
        <CharSubsection title="long">
          <CharList chars={ vowelsLongs } />
        </CharSubsection>
      </CharSection>
      <CharSection title="diphtongs">
        <CharSubsection title="short">
          <CharList chars={ diphtongsShorts } />
        </CharSubsection>
        <CharSubsection title="long">
          <CharList chars={ diphtongsLongs } />
        </CharSubsection>
      </CharSection>
      <CharSection title="glides">
        <CharSubsection title="short">
          <CharList chars={ glidesShorts } />
        </CharSubsection>
        <CharSubsection title="long">
          <CharList chars={ glidesLongs } />
        </CharSubsection>
      </CharSection>
      <CharSection title="miscellaneous">
          <CharList chars={ miscellaneous } />
      </CharSection>
    </Fragment>
  )
}
