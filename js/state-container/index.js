import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import crio from 'crio'

import dictionary from '../models/dico-all.js'
import { loadSettings, saveSettings } from './settings-storage.js'
import { settings } from './settings-reducers'
import { chars, filtered } from './chars-reducers'

const reducers    = combineReducers({
  settings,
  chars,
  filtered,
})

const INITIAL_STATE = loadSettings()
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
    saveSettings( {settings: state.settings} )
  }
  previousState = state
})

export {
  store as default,
}
