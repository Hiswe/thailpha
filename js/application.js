import React from 'react'
import { render } from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom'
import { Provider } from 'react-redux'

import '../css/index.scss'

import store from './state-container'
import Consonants from '~/pages/consonants'
import Vowels from '~/pages/vowels'
import Numbers from '~/pages/numbers'
import PageAbout from '~/pages/about'
import Search from '~/pages/search'
import CharDetail from '~/pages/char-detail'
import MainNav from '~/components/main-nav'
import registerServiceWorker from '~/register-service-worker'

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
        <Route exact path={`/`} component={Consonants} />
        <Route path={`/vowels`} component={Vowels} />
        <Route path={`/numbers`} component={Numbers} />
        <Route path={`/about`} component={PageAbout} />
        <Route path={`/search`} component={Search} />
        <Route path={`/char/:longId`} component={CharDetail} />
        <Redirect to={`/`} />
      </Switch>
      <Route path={`/`} component={MainNav} />
    </div>
  )
}

render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById(`main`)
)
registerServiceWorker()
// ;(function() {
//   if (!`serviceWorker` in navigator) return
//   navigator.serviceWorker
//     .register(`/thailpha-sw.js`)
//     .then(reg => {
//       reg.addEventListener('updatefound', () => {
//         console.log('updatefound')
//         // A wild service worker has appeared in reg.installing!
//         const newWorker = reg.installing

//         newWorker.state
//         // "installing" - the install event has fired, but not yet complete
//         // "installed"  - install complete
//         // "activating" - the activate event has fired, but not yet complete
//         // "activated"  - fully active
//         // "redundant"  - discarded. Either failed install, or it's been
//         //                replaced by a newer version

//         newWorker.addEventListener('statechange', () => {
//           console.log('newworker statechange')
//           console.log(newWorker)
//           // newWorker.state has changed
//         })
//       })
//     })
//     .catch(error => {
//       console.log('sorry', error)
//     })
// })()
