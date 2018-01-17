import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route,  Redirect, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import Transition from 'react-transition-group/Transition'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import CSSTransition from 'react-transition-group/CSSTransition'

import store from './state-container'
import Consonnants from './consonants.jsx'
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
      <TransitionGroup>
        <CSSTransition key={window.location.pathname} timeout={timeout} classNames="fade" appear>
          {/* warning! check service-worker.js if adding or removing routes */}
          <Switch>
            <Route exact path="/" component={ Consonnants } />
            <Route path="/vowels" component={ Vowels } />
            <Route path="/numbers" component={ Numbers } />
            <Route path="/about" component={ About } />
            <Route path="/search" component={ Search } />
            <Route path="/char/:longId" component={ CharDetail } />
            <Redirect to="/" />
          </Switch>

        </CSSTransition>
      </TransitionGroup>

      <Route path="/" component={ MainNav } />

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
  if (!navigator.serviceWorker) return
  navigator
  .serviceWorker
  .register( '/service-worker.js' )
  .catch( error => {
    console.log('sorry', error)
  })
})()
