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
        <dt className="about__topic">Detail disposition</dt>
        <dd className="about__detail">
          <p>
            When clicking on a character you access a more complete view of it.<br />
          </p>
          <ul>
            <li>
              When your device is in <strong>landscape mode, a full description</strong> will be provided.
            </li>
            <li>
              The <strong>consonants</strong> are always presentend as two words. (ex: <cite>ko kai</cite>).<br />
              The <strong>translation</strong> refers always to <strong>the second part of the letter name</strong> (in the previous example <cite>“kai”</cite> only tranlate to <cite>“chicken”</cite>)
            </li>
          </ul>
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
        <dt className="about__topic">Author &amp; suggestions</dt>
        <dd className="about__detail">
          <p>brought to you by Yannick “Hiswe” Aïvayan</p>
          <ul>
            <li>working at <a href="https://www.goodenough.agency/">goodenough</a></li>
            <li>drawing on <a href="https://hiswe.deviantart.com/">deviantart</a> &amp; <a href="http://hiswe.tumblr.com/">tumblr</a></li>
          </ul>
          <p>Any suggestions can be send:</p>
          <ul>
            <li>using the form on <a href="http://www.hiswe.net/contact" target="_blank" className="link">hiswe.net</a></li>
            <li>creating a ticket on <a href="https://github.com/Hiswe/thailpha/issues" target="_blank" className="link">the github repo</a></li>
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