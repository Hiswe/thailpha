import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route,  Redirect, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'

import store from './state-container'
import Consonants from './consonants.jsx'
import Vowels from './vowels.jsx'
import Numbers from './numbers.jsx'
import About from './about.jsx'
import Search from './search.jsx'
import CharDetail from './char-detail.jsx'
import MainNav from './main-nav.jsx'

// animation copied from
// https://github.com/ReactTraining/react-router/issues/5279
// and mostly
// https://codesandbox.io/s/4RAqrkRkn?view=preview
const timeout = { enter: 300, exit: 200 }
const App = props => {
  return (
    <div id="app-wrapper">
      {/* warning! check service-worker.js if adding or removing routes */}
      <Switch>
        <Route exact path={`${BASE_URL}/`} component={ Consonants } />
        <Route path={`${BASE_URL}/vowels`} component={ Vowels } />
        <Route path={`${BASE_URL}/numbers`} component={ Numbers } />
        <Route path={`${BASE_URL}/about`} component={ About } />
        <Route path={`${BASE_URL}/search`} component={ Search } />
        <Route path={`${BASE_URL}/char/:longId`} component={ CharDetail } />
        <Redirect to={`${BASE_URL}/`} />
      </Switch>
      <Route path={`${BASE_URL}/`} component={ MainNav } />
    </div>
  )
}

render(
  (
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  ),
  document.getElementById( 'main' )
)

;(function() {
  if (!`serviceWorker` in navigator) return
  navigator
  .serviceWorker
  .register( `${BASE_URL}/thailpha-sw.js` )
  .then( reg  => {
    reg.addEventListener( 'updatefound', () => {
      console.log( 'updatefound' )
      // A wild service worker has appeared in reg.installing!
      const newWorker = reg.installing;

      newWorker.state;
      // "installing" - the install event has fired, but not yet complete
      // "installed"  - install complete
      // "activating" - the activate event has fired, but not yet complete
      // "activated"  - fully active
      // "redundant"  - discarded. Either failed install, or it's been
      //                replaced by a newer version

      newWorker.addEventListener( 'statechange', () => {
        console.log( 'newworker statechange' )
        console.log( newWorker )
        // newWorker.state has changed
      });
    });
  })
  .catch( error => {
    console.log('sorry', error)
  })
})()
