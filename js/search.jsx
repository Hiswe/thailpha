import { h } from 'preact'
import { filterChar } from './actions.js'
import { connect } from 'react-redux'

import CharSection from './char-section.jsx'
import CharList from './char-list.jsx'

const Search = props => {
  const { handleSearch, handleReset, chars } = props
  return (
    <CharSection title="search">
      <form className="search">
        {/* not using a inpu[type="search"] because harder to style '¬_¬  */}
        <input required type="text" onInput={ handleSearch } className="search__input" placeholder="search" />
        <button className="search__reset" onClick={ handleReset } type="reset">
          <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </form>
      { chars && chars.length ? <CharList chars={ chars } /> : <p className="search-no-result">No result</p> }
    </CharSection>
  )
}

const mapStateToProp = state => {
  return { chars: state.filtered }
}

const mapDispatchToProps = {
  handleSearch( e ) {
    return filterChar( e.target.value )
  },
  handleReset( e ) {
    return filterChar( '' )
  }
}

const SearchContainer = connect( mapStateToProp, mapDispatchToProps )( Search )

export { SearchContainer as default }
