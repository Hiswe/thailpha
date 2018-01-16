import { h } from 'preact'
import { connect } from 'react-redux'

import { version } from '../package.json'
import { toggleSetting } from './actions.js'

const Settings = props => {
  const { settings, handleChange, version } = props
  return (
    <section className="settings">
      <h1 className="h1">About THailpha</h1>
      {/* <form>
        <input id="showObsolete" type="checkbox" checked={settings.showObsolete} onChange={handleChange} />
        <label htmlFor="showObsolete">show obsolete letters</label>
        <input id="showNumbers" type="checkbox" checked={settings.showNumbers} onChange={handleChange} />
        <label htmlFor="showNumbers">show numbers</label>
      </form> */}
    </section>
  )
}

const mapStateToProp = state => {
  return {
    settings: state.settings,
  }
}

const mapDispatchToProps = {
  handleChange( e ) {
    return toggleSetting({
      key:    e.target.id,
      value:  e.target.checked,
    })
  }
}

const SettingsContainer = connect( mapStateToProp, mapDispatchToProps )( Settings )

export { SettingsContainer as default }
