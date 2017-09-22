import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Link } from 'react-router-dom'

import MainNav from './main-nav.jsx'
import CharSection from './char-section.jsx'
import CharSubsection from './char-subsection.jsx'
import CharList from './char-list.jsx'
import * as chars from './models/letters.js'


const Home = props => (
  <div id="app-wrapper">

    <CharSection title="consonnants">
      <CharList chars={chars.getConsonants()} />
    </CharSection>

    <CharSection title="vowels">
      <CharSubsection title="short">
        <CharList chars={chars.getVowels().short()} />
      </CharSubsection>
      <CharSubsection title="long">
        <CharList chars={chars.getVowels().long()} />
      </CharSubsection>
    </CharSection>

    <CharSection title="numbers">
      <CharList chars={chars.getNumbers()} />
    </CharSection>

    <MainNav />

  </div>
)

render(
  <Home />,
  document.getElementById( 'main' )
)

