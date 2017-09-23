import React from 'react'
import { NavLink } from 'react-router-dom'

const MainNav = props => (
  <nav className="main-nav">
    <input type="text" disabled className="main-nav__search" placeholder="search" />

    <NavLink to="/" exact={true} activeClassName="is-active" className="main-nav__btn">
      consonants
    </NavLink>

    <NavLink to="/vowels" activeClassName="is-active" className="main-nav__btn">
      vowels
    </NavLink>

    <NavLink to="/numbers" activeClassName="is-active" className="main-nav__btn">
      numbers
    </NavLink>

    <NavLink to="/settings" activeClassName="is-active" className="main-nav__btn">
      <svg className="icon icon-settings" role="img">
        <use href="#icon-settings" />
      </svg>
    </NavLink>

  </nav>
)

export { MainNav as default }
