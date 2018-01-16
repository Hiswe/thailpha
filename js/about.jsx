import { h } from 'preact'
import { connect } from 'react-redux'

import { version } from '../package.json'
import { toggleSetting } from './actions.js'

const About = ({version}) => {
  return (
    <section className="about">
      <h1 className="h1 about__title">About THailpha</h1>
      <dl className="about__section">
        <dt className="about__topic">Sources &amp; transcriptions</dt>
        <dd className="about__detail">
          <p>All information are provided by: </p>
          <ul>
            <li><a href="http://en.wikipedia.org/wiki/Thai_alphabet" target="_blank" className="link">wikipedia</a></li>
            <li><a href="http://thai-language.com/ref/vowels" target="_blank" className="link">thai-language.com</a> (mainly for the vowels)</li>
          </ul>
          <p>About transcription from Thai char to latin char:</p>
          <blockquote class="blockquote" cite="http://thai-language.com/ref/phonemic-transcription">
            <p>There is no standardized romanization scheme for Thai, and many different schemes are in use by different texts and websites.</p>
            <footer class="blockquote__footer">
              <a href="http://thai-language.com/ref/phonemic-transcription" target="_blank" className="link">thai-language.com</a>
            </footer>
          </blockquote>
        </dd>
      </dl>
      <dl className="about__section">
        <dt className="about__topic">Share the app</dt>
        <dd className="about__detail">
          <p>The app can be shared with this link </p>
          <a href="https://thailpha-9e56f.firebaseapp.com">https://thailpha-9e56f.firebaseapp.com</a>
        </dd>
      </dl>
      <dl className="about__section">
        <dt className="about__topic">Any suggestions?</dt>
        <dd className="about__detail">
          <a href="https://github.com/Hiswe/thailpha/issues" target="_blank" className="link">send here</a>
        </dd>
      </dl>
      <dl className="about__section">
        <dt className="about__topic">The author?</dt>
        <dd className="about__detail">
          <p>brought to you by Yannick “Hiswe” Aïvayan</p>
          <ul>
            <li>working at <a href="https://www.goodenough.agency/">goodenough</a></li>
            <li>drawing on <a href="https://hiswe.deviantart.com/">deviantart</a> &amp; <a href="http://hiswe.tumblr.com/">tumblr</a></li>
          </ul>
        </dd>
      </dl>
      <footer className="about__footer">
        <p className="version">
          <span> version </span>
          <span>{ version }</span>
        </p>
      </footer>
    </section>
  )
}

const mapStateToProp = state => {
  return {
    version,
  }
}

const AboutContainer = connect( mapStateToProp )( About )

export { AboutContainer as default }
