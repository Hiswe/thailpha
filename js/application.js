import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import posed, { PoseGroup } from 'react-pose'

import '../css/index.scss'

import Consonants from '~/pages/consonants'
import Vowels from '~/pages/vowels'
import Numbers from '~/pages/numbers'
import PageAbout from '~/pages/about'
import Search from '~/pages/search'
import CharDetail from '~/pages/char-detail'
import MainNav from '~/components/main-nav'
import registerServiceWorker from '~/register-service-worker'

const RoutesContainer = posed.div({
  enter: { opacity: 1, delay: 300, beforeChildren: true },
  exit: { opacity: 0 },
})

const App = props => {
  return (
    <Route
      render={({ location }) => (
        <div id="app-wrapper">
          <PoseGroup>
            <RoutesContainer key={location.key}>
              {/* warning! check service-worker.js if adding or removing routes */}
              <Switch location={location}>
                <Route exact path={`/`} component={Consonants} />
                <Route path={`/vowels`} component={Vowels} />
                <Route path={`/numbers`} component={Numbers} />
                <Route path={`/about`} component={PageAbout} />
                <Route path={`/search`} component={Search} />
                <Route path={`/char/:longId`} component={CharDetail} />
                <Redirect to={`/`} />
              </Switch>
            </RoutesContainer>
          </PoseGroup>
          <Route path={`/`} component={MainNav} />
        </div>
      )}
    />
  )
}

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById(`main`)
)

registerServiceWorker()
