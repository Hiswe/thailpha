import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import MainNav from './main-nav.jsx'
import CharSection from './char-section.jsx'
import CharSubsection from './char-subsection.jsx'
import CharList from './char-list.jsx'
import Settings from './settings.jsx'
import * as chars from './models/letters.js'


const Consonnants = () => (
  <CharSection title="consonnants">
    <CharList chars={chars.getConsonants()} />
  </CharSection>
)

const Vowels = () => (
  <CharSection title="vowels">
    <CharSubsection title="short">
      <CharList chars={chars.getVowels().short()} />
    </CharSubsection>
    <CharSubsection title="long">
      <CharList chars={chars.getVowels().long()} />
    </CharSubsection>
  </CharSection>
)

const Numbers = () => (
  <CharSection title="numbers">
    <CharList chars={chars.getNumbers()} />
  </CharSection>
)

const App = props => (
  <Router>
    <div id="app-wrapper">

      <Route exact path="/" component={Consonnants} />
      <Route exact path="/vowels" component={Vowels} />
      <Route exact path="/numbers" component={Numbers} />
      <Route exact path="/settings" component={Settings} />

      <MainNav />

    </div>
  </Router>
)

render(
  <App />,
  document.getElementById( 'main' )
)
