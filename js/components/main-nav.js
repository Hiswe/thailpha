import React from 'react'
import { NavLink } from 'react-router-dom'

import SvgIcon from '~/components/svg-icon'

const MainNav = props => {
  return (
    <nav className="main-nav">
      <NavLink
        to={`${__BASE_URL__}/`}
        exact={true}
        activeClassName="is-active"
        className="main-nav__btn main-nav__btn--chars"
      >
        consonants
      </NavLink>

      <NavLink
        to={`${__BASE_URL__}/vowels`}
        activeClassName="is-active"
        className="main-nav__btn main-nav__btn--chars"
      >
        vowels
      </NavLink>

      <NavLink
        to={`${__BASE_URL__}/numbers`}
        activeClassName="is-active"
        className="main-nav__btn main-nav__btn--chars"
      >
        numbers
      </NavLink>

      <NavLink
        to={`${__BASE_URL__}/search`}
        activeClassName="is-active"
        className="main-nav__btn"
      >
        <SvgIcon svgId="search" />
      </NavLink>

      <NavLink
        to={`${__BASE_URL__}/about`}
        activeClassName="is-active"
        className="main-nav__btn"
      >
        <SvgIcon svgId="info-outline" />
      </NavLink>
    </nav>
  )
}

export default MainNav
