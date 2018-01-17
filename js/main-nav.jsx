import React from 'react'
import { NavLink } from 'react-router-dom'

import { Icon } from './svg-symbol.jsx'

const MainNav = props => {

  return (
    <nav className="main-nav">
      <NavLink to="/" exact={true} activeClassName="is-active" className="main-nav__btn main-nav__btn--chars">
        consonants
      </NavLink>

      <NavLink to="/vowels" activeClassName="is-active" className="main-nav__btn main-nav__btn--chars">
        vowels
      </NavLink>

      <NavLink to="/numbers" activeClassName="is-active" className="main-nav__btn main-nav__btn--chars">
        numbers
      </NavLink>

      <NavLink to="/search" activeClassName="is-active" className="main-nav__btn  ">
        <Icon svgId="search" />
      </NavLink>

      <NavLink to="/about" activeClassName="is-active" className="main-nav__btn">
        <Icon svgId="info-outline" />
      </NavLink>

    </nav>
  )
}

export { MainNav as default }
