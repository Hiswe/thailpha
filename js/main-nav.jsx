import React from 'react'
import { NavLink } from 'react-router-dom'

import { Icon } from './svg-symbol.jsx'

const MainNav = props => {

  return (
    <nav className="main-nav">
      <NavLink to={`${BASE_URL}/`} exact={true} activeClassName="is-active" className="main-nav__btn main-nav__btn--chars">
        consonants
      </NavLink>

      <NavLink to={`${BASE_URL}/vowels`} activeClassName="is-active" className="main-nav__btn main-nav__btn--chars">
        vowels
      </NavLink>

      <NavLink to={`${BASE_URL}/numbers`} activeClassName="is-active" className="main-nav__btn main-nav__btn--chars">
        numbers
      </NavLink>

      <NavLink to={`${BASE_URL}/search`} activeClassName="is-active" className="main-nav__btn  ">
        <Icon svgId="search" />
      </NavLink>

      <NavLink to={`${BASE_URL}/about`} activeClassName="is-active" className="main-nav__btn">
        <Icon svgId="info-outline" />
      </NavLink>

    </nav>
  )
}

export { MainNav as default }
