import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

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
        <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      </NavLink>

      <NavLink to="/about" activeClassName="is-active" className="main-nav__btn">
        <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"/>
        </svg>
      </NavLink>

    </nav>
  )
}

export { MainNav as default }
