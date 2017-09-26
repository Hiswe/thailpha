import { h } from 'preact'
import { connect } from 'react-redux'

import { version } from '../package.json'
import { toggleSetting } from './actions.js'

const About = props => {
  return (
    <div className="about">
      <p>
        <span>brought to you by Yannick “Hiswe” Aïvayan</span>
        <ul>
          <li>working at <a href="https://www.goodenough.agency/">goodenough</a></li>
          <li>drawing on <a href="https://hiswe.deviantart.com/">deviantart</a> &amp; <a href="http://hiswe.tumblr.com/">tumblr</a></li>
        </ul>
      </p>
      <p>
        <span>all information are provided by </span>
        <a href="http://en.wikipedia.org/wiki/Thai_alphabet" target="_blank" className="link">wikipedia</a>
      </p>
      <p>
        <span>The app can be shared with this link </span>
        <a href="https://thailpha.surge.sh/">https://thailpha.surge.sh/</a>
      </p>
      <p>
        <span>any suggestions? </span>
        <a href="https://github.com/Hiswe/thailpha/issues" target="_blank" className="link">send here</a>
      </p>
      <p className="version">
        <span> version </span>
        <span>{ version }</span>
      </p>
    </div>
  )
}

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
      < About />
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
