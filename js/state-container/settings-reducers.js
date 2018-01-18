import crio from 'crio'

const INITIAL_SETTINGS = crio({
  showConsonantsHelp: false,
})

const settings = ( state = INITIAL_SETTINGS , action ) => {
  switch (action.type) {
    case 'TOGGLE_SETTING':
      if ( !state.has(action.key) ) return state
      if ( typeof action.value === 'undefined' ) {
        action.value = !state.get( action.key )
      }
      return state.set( action.key, action.value )
    default:
      return state
  }
}

export {
  settings,
}
