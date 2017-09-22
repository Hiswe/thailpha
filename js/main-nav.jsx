import React from 'react'

const MainNav = props => (
  <nav className="main-nav">
    <input type="text" className="main-nav__search" placeholder="search" />
    <a href="#settings" className="main-nav__settings">
      <svg className="icon icon-settings" role="img">
        <use href="#icon-settings" />
      </svg>
    </a>
  </nav>
)

export { MainNav as default }
