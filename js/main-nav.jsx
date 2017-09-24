import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

import { filterChar } from './actions.js'

const MainNav = props => {
  return (
    <nav className="main-nav">
      <input type="search" onInput={ props.filterChar } className="main-nav__search" placeholder="search" />

      <NavLink to="/" exact={true} activeClassName="is-active" className="main-nav__btn">
        consonants
      </NavLink>

      <NavLink to="/vowels" activeClassName="is-active" className="main-nav__btn">
        vowels
      </NavLink>

      <NavLink to="/numbers" activeClassName="is-active" className="main-nav__btn">
        numbers
      </NavLink>

      {/* disable settings for now */}
      {/* <NavLink to="/settings" activeClassName="is-active" className="main-nav__btn">
        <svg className="icon icon-settings" role="img">
          <use href="#icon-settings" />
        </svg>
      </NavLink> */}

    </nav>
  )
}

const mapDispatchToProps = {
  filterChar,  
}

const MainNavContainer = connect( null, mapDispatchToProps )( MainNav )

export { MainNavContainer as default }
