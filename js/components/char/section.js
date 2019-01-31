import React from 'react'

const CharSection = props => (
  <section className="char-section">
    <header className="char-section__header">
      <h1 className="h1">{props.title}</h1>
    </header>
    {props.children}
  </section>
)

export default CharSection
