import React, { PureComponent } from 'react'

import CharSection from '~/components/char/section'
import CharList from '~/components/char/list'
import INITIAL_CHARS from '~/models/dico-all.js'

const getRelevanceForSearch = (search, str = '', factor = 1) => {
  let myArray
  let occurences = 0
  while ((myArray = search.exec(str)) !== null) {
    occurences += 1
  }
  return occurences * factor
}

const getFiltered = search => {
  const query = search.toLowerCase().trim()
  if (!query) return INITIAL_CHARS
  const searchResult = INITIAL_CHARS.reduce((result, char) => {
    const { rtgs, meaning, letter, thai } = char
    let relevance = 0
    const queryRegexp = new RegExp(query, 'gi')
    const isCompoundRtgs = /^\w*\s\w$/i.test(rtgs)
    if (isCompoundRtgs) {
      const secondWord = new RegExp(`\s${query}$`, 'gi')
      const firstWord = new RegExp(`^${query}\s`, 'gi')
      relevance += getRelevanceForSearch(secondWord, rtgs, 4)
      relevance += getRelevanceForSearch(firstWord, rtgs, 2)
      relevance += getRelevanceForSearch(queryRegexp, rtgs, 1)
    } else {
      const exactMatch = new RegExp(`^${query}$`, 'gi')
      relevance += getRelevanceForSearch(exactMatch, rtgs, 8)
      relevance += getRelevanceForSearch(queryRegexp, rtgs, 2)
    }
    relevance += getRelevanceForSearch(queryRegexp, meaning)
    relevance += getRelevanceForSearch(queryRegexp, letter, 3)
    relevance += getRelevanceForSearch(queryRegexp, thai)
    if (relevance > 0) result.push([char, relevance])
    return result
  }, [])
    .sort((a, b) => a[1] < b[1])
    .map(a => a[0])

  return searchResult
}

class Search extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      chars: INITIAL_CHARS,
    }
    this.handleSearch = this.handleSearch.bind(this)
    this.handleReset = this.handleReset.bind(this)
  }

  handleSearch(event) {
    const { value } = event.target
    this.setState(() => ({
      chars: getFiltered(value),
    }))
  }

  handleReset() {
    this.setState(() => ({
      chars: INITIAL_CHARS,
    }))
  }

  render() {
    const { state } = this
    return (
      <CharSection title="search">
        <form className="search">
          {/* not using a inpu[type="search"] because harder to style '¬_¬  */}
          <input
            required
            type="text"
            onInput={this.handleSearch}
            className="search__input"
            placeholder="type your request here"
          />
          <button
            className="search__reset"
            onClick={this.handleReset}
            type="reset"
          >
            <svg
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </form>
        {state.chars && state.chars.length ? (
          <CharList chars={state.chars} />
        ) : (
          <p className="search-no-result">No result</p>
        )}
      </CharSection>
    )
  }
}

export default Search
