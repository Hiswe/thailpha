import React from 'react'
import { connect } from 'react-redux'

import { version } from '../package.json'
import { toggleSetting } from './actions.js'


const Settings = props => {
  const { settings, handleChange } = props
  return (
    <section className="settings">
      <h1 className="h1">Settings</h1>
      <form>
        <input id="showObsolete" type="checkbox" checked={settings.showObsolete} onChange={handleChange} />
        <label htmlFor="showObsolete">show obsolete letters</label>
        <input id="showNumbers" type="checkbox" checked={settings.showNumbers} onChange={handleChange} />
        <label htmlFor="showNumbers">show numbers</label>
      </form>
      <footer className="settings__footer">
        <p>
        <span>all information are provided by </span>
          <a href="http://en.wikipedia.org/wiki/Thai_alphabet" target="_blank" className="link">wikipedia</a>
        </p>
        <p>
          <span>any suggestions? </span>
          <a href="https://github.com/Hiswe/thailpha/issues" target="_blank" className="link">send here</a>
        </p>
        <p className="version">
          <a href="https://thailpha.surge.sh/">https://thailpha.surge.sh/</a>
          <span> version </span>
          <span>{ version }</span>
        </p>
      </footer>
    </section>
  )
}

const mapStateToProp = state => {
  return { settings: state.settings }
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
