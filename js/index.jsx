import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route,  Redirect, Switch } from 'react-router-dom'
import { Provider, connect } from 'react-redux'


import * as chars from './models/letters.js'
import store from './store.js'

import MainNav from './main-nav.jsx'
import CharSection from './char-section.jsx'
import CharSubsection from './char-subsection.jsx'
import CharList from './char-list.jsx'
import Settings from './settings.jsx'
import CharDetail from './char-detail.jsx'

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
  <Provider store={store}>
    <Router>
      <div id="app-wrapper">
        <Switch>  
          <Route exact path="/" component={Consonnants} />
          <Route path="/vowels" component={Vowels} />
          <Route path="/numbers" component={Numbers} />
          <Route path="/settings" component={Settings} />
          <Route path="/settings" component={Settings} />
          <Route path="/char/:longId" component={CharDetail} />
          <Redirect to="/" />
        </Switch>  

        <MainNav />

      </div>
    </Router>
  </Provider>
)

render(
  <App />,
  document.getElementById( 'main' )
)
