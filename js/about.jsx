import React from 'react'
import { connect } from 'react-redux'

import { version } from '../package.json'

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
            <li><a href="http://thai-language.com" target="_blank" className="link">thai-language.com</a> (mainly for the <a href="http://thai-language.com/ref/vowels" target="_blank" className="link">vowels</a>)</li>
          </ul>
          <p>About transcription from Thai char to latin char:</p>
          <blockquote className="blockquote" cite="http://thai-language.com/ref/phonemic-transcription">
            <p>There is no standardized romanization scheme for Thai, and many different schemes are in use by different texts and websites.</p>
            <footer className="blockquote__footer">
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
      <dl className="about__section">
        <dt className="about__topic">Ressources</dt>
        <dd className="about__detail">
          <ul>
            <li>Icons coming from: <a href="https://material.io/icons" target="_blank" className="link">Google Material Icon</a></li>
            <li>Font used for the colored chars <a href="http://www.f0nt.com/release/th-sarabun-new/" target="_blank" className="link">TH Sarabun New</a></li>
          </ul>
        </dd>
      </dl>
      {/*  */}
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
