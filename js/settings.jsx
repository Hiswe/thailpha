import React from 'react'

const Settings = props => (
  <section className="settings">
    <h1 className="h1">Settings</h1>
    <form>
      <input id="showObsolete" type="checkbox" />
      <label htmlFor="showObsolete">show obsolete letters</label>
      <input id="showNumbers" type="checkbox" />
      <label htmlFor="showNumbers">show numbers</label>
      <p>
        <button className="btn">save</button>
      </p>
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
        <span>x.x.x</span>
      </p>
    </footer>
  </section>
)

export { Settings as default }
