import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { version } from '../package.json'
import { Icon } from './svg-symbol.jsx'

const BASE_CLASS = `about`

function AboutSection( props ) {
  return (
    <dl className={ `${BASE_CLASS}__section` }>
      <dt className={ `${BASE_CLASS}__topic` }>
        { props.topic }
      </dt>
      <dd className={ `${BASE_CLASS}__detail` }>
        { props.children }
      </dd>
    </dl>
  )
}

class About extends PureComponent {

  constructor( props ) {
    super( props )
  }

  render() {
    const { props } = this
    const { version } = props
    return (
      <section className={ BASE_CLASS }>
        <h1 className={ `h1 ${BASE_CLASS}__title` }>About Thailpha</h1>
        <AboutSection topic="Sources &amp; transcriptions">
          <p>All information are provided by: </p>
          <ul>
            <li><a href="https://en.wikipedia.org/wiki/Thai_alphabet" target="_blank" className="link">wikipedia</a></li>
            <li><a href="http://thai-language.com" target="_blank" className="link">thai-language.com</a> (mainly for the <a href="http://thai-language.com/ref/vowels" target="_blank" className="link">vowels</a>)</li>
          </ul>
          <p>About transcription from Thai char to latin char:</p>
          <blockquote className="blockquote" cite="http://thai-language.com/ref/phonemic-transcription">
            <p>There is no standardized romanization scheme for Thai, and many different schemes are in use by different texts and websites.</p>
            <footer className="blockquote__footer">
              <a href="http://thai-language.com/ref/phonemic-transcription" target="_blank" className="link">thai-language.com</a>
            </footer>
          </blockquote>
        </AboutSection>
        <AboutSection topic="Detailed disposition">
          <p>
            When clicking on a character you access a more complete view of it.<br />
          </p>
          <ul>
            <li>
              When your device is in <strong>landscape mode, a full description</strong> will be provided.
            </li>
          </ul>
        </AboutSection>
        <AboutSection topic="Share the app">
          <p>The app can be shared with this link </p>
          <a href="https://thailpha-3e7f6.firebaseapp.com/">https://thailpha-3e7f6.firebaseapp.com/</a>
          <p>or this QR code</p>
          <Icon svgId="thailpha-firebase" />
        </AboutSection>
        <AboutSection topic="Author &amp; suggestions">
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
        </AboutSection>
        <AboutSection topic="Ressources">
          <ul>
            <li>Icons coming from: <a href="https://material.io/icons" target="_blank" className="link">Google Material Icon</a></li>
            <li>Font used for the colored chars <a href="http://www.f0nt.com/release/th-sarabun-new/" target="_blank" className="link">TH Sarabun New</a></li>
          </ul>
        </AboutSection>
        <footer className={ `${BASE_CLASS}__footer` }>
          <p className="version">
            <span> version </span>
            <span>{ version }</span>
          </p>
        </footer>
      </section>
    )
  }
}

function state2prop( state ) {
  return {
    version,
  }
}

export default connect( state2prop )( About )
