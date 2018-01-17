import crio from 'crio'

const INITIAL_SETTINGS = crio({
  showConsonantsHelp: false,
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

export {
  settings,
}
