import { h } from 'preact'
import { connect } from 'react-redux'

import { version } from '../package.json'
import { toggleSetting } from './actions.js'

const About = props => {
  return (
    <div className="about">
      <p>
        <span>all information are provided by: </span>
        <ul>
          <li><a href="http://en.wikipedia.org/wiki/Thai_alphabet" target="_blank" className="link">wikipedia</a></li>
          <li><a href="http://thai-language.com/ref/vowels" target="_blank" className="link">thai-language.com</a> (mainly for the vowels)</li>
        </ul>
        <span>about transcription from Thai char to latin char:</span>
        <blockquote class="blockquote" cite="http://thai-language.com/ref/phonemic-transcription">
          <p>There is no standardized romanization scheme for Thai, and many different schemes are in use by different texts and websites.</p>
          <footer class="blockquote__footer">thai-language.com <cite title="go see the full article"><a href="http://thai-language.com/ref/phonemic-transcription" target="_blank" className="link">(source)</a></cite></footer>
        </blockquote>
      </p>

      <p>
        <span>The app can be shared with this link </span>
        <a href="https://thailpha-9e56f.firebaseapp.com">https://thailpha-9e56f.firebaseapp.com</a>
      </p>
      <p>
        <span>any suggestions? </span>
        <a href="https://github.com/Hiswe/thailpha/issues" target="_blank" className="link">send here</a>
      </p>
      <p>
        <span>brought to you by Yannick “Hiswe” Aïvayan</span>
        <ul>
          <li>working at <a href="https://www.goodenough.agency/">goodenough</a></li>
          <li>drawing on <a href="https://hiswe.deviantart.com/">deviantart</a> &amp; <a href="http://hiswe.tumblr.com/">tumblr</a></li>
        </ul>
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
