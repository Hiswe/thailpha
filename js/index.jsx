import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route,  Redirect, Switch } from 'react-router-dom'
import { Provider, connect } from 'react-redux'

import * as chars from './models/letters.js'
import store from './store.js'

import Consonnants from './consonants.jsx'
import Vowels from './vowels.jsx'
import Numbers from './numbers.jsx'
import MainNav from './main-nav.jsx'
import Settings from './settings.jsx'
import CharDetail from './char-detail.jsx'

const App = props => (
  <Provider store={store}>
    <Router>
      <div id="app-wrapper">
        <Switch>  
          <Route exact path="/" component={Consonnants} />
          <Route path="/vowels" component={Vowels} />
          <Route path="/numbers" component={Numbers} />
          {/* settings are useless for now */}
          {/* <Route path="/settings" component={Settings} /> */}
          <Route path="/char/:longId" component={CharDetail} />
          <Redirect to="/" />
        </Switch>  

        <Route path="/" component={MainNav} />

      </div>
    </Router>
  </Provider>
)

render(
  <App />,
  document.getElementById( 'main' )
)
