import crio from 'crio'

const STORE_NAME = 'THAILPHA'

// taken from
// https://egghead.io/lessons/javascript-redux-persisting-the-state-to-the-local-storage

const loadState = () => {
  // `try/catch` because users can forbid access to `localStorage` with privacy settings
  try {
    const serializedState = localStorage.getItem( STORE_NAME )
    if ( serializedState === null) return undefined
    return JSON.parse( serializedState )
  } catch (err) {
    return undefined
  }
}

const saveSate = state => {
  try {
    const serializedState = JSON.stringify( state )
    localStorage.setItem( STORE_NAME, serializedState )
  } catch (err) {
    console.error( err )
  }
}

export {
  loadState,
  saveSate,
}
