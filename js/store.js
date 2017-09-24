import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import crio from 'crio'

import consonants  from './models/dico-consonants.js'
import shortVowels from './models/dico-short-vowels.js'
import longVowels  from './models/dico-long-vowels.js'
import numbers     from './models/dico-numbers.js'
import { loadState, saveSate } from './storage.js'

const INITIAL_SETTINGS = crio({
  showObsolete: true,
  showNumbers: true,
})
const settings = ( state = INITIAL_SETTINGS , action ) => {
  switch (action.type) {
    case 'TOGGLE_SETTING':
      if ( !action.key in state ) return state
      return state.set( action.key, action.value )
    default:
      return state
  }
}

const INITIAL_CHARS = crio( [...consonants, ...shortVowels, ...longVowels, ...numbers] )
const chars       = ( state = INITIAL_CHARS , action ) => {
  return state
}

const reducers    = combineReducers({
  settings,
  chars,
})

const INITIAL_STATE = loadState()
// freeze only `settings` as redux expect a regular plain object as initial values
// http://redux.js.org/docs/api/createStore.html#arguments
if (INITIAL_STATE && INITIAL_STATE.settings ) INITIAL_STATE.settings = crio( INITIAL_STATE.settings )

const store  = createStore( reducers, INITIAL_STATE, window.devToolsExtension ? window.devToolsExtension() : f => f )

let previousState = store.getState()
// subscribe for change so we can save datas if needed
store.subscribe( () => {
  const state = store.getState()
  if ( previousState.settings !== state.settings ) {
    // save only the settings in storage
    // no need to save more :)    
    saveSate( {settings: state.settings} )
  }
  previousState = state
})

export {
  store as default,
}
