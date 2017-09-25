import React, { Component } from 'react'
import { connect } from 'react-redux'
import crio from 'crio'
import { Link } from 'react-router-dom'
// import zenscroll from 'zenscroll'

const Pronunciation = ({char}) => {
  const { pronunciation } = char
  if ( !pronunciation ) return null
  if ( typeof pronunciation === 'string' ) {
    return (
      <div className="letter-pronunciation">
        <span>{ pronunciation }</span>
      </div>
    )
  }
  return (
    <div className="letter-pronunciation">
      <span className="letter-pronunciation-label">start</span>
      <span>{ pronunciation.initial }</span>
      <span className="letter-pronunciation-label">final</span>
      <span>{ pronunciation.final }</span>
      <span className="letter-pronunciation-label">class</span>
      <span>{ char.class }</span>
    </div>
  )
}

const makeIdFromThaiText = groupOfThaiLetters => {
  return Array
  .from( {length: groupOfThaiLetters.length} )
  .map( (value, index) => groupOfThaiLetters.codePointAt( index ) )
  .join( '-' )
}

const Variant  = ({variant}) => {
  if ( !variant ) return null
  return (
    <ul className="letter-variant">
      { variant.map( v => <li className="thai-letter" key={ makeIdFromThaiText(v) }>{ v }</li> ) }
    </ul>
  )
}

const SimilarHint = ({similar}) => {
  if (!similar.length) return null
  return <p className="letter-hint">↓ similar ↓</p>
}

const SimilarChar = ({char}) => {
  return (
    <tr>
      <td className="thai-letter">
        <Link to={ `/char/${ char.longId }` }>{ char.letter }</Link>
      </td>
      <td>{ char.rtgs }</td>
      <td>{ char.pronunciation.initial }</td>
      <td>{ char.pronunciation.final }</td>
    </tr>
  )
}

const SimilarList = ({similar}) => {
  if ( !similar.length ) return null
  return (
  <table>
    <tbody>
      { similar.map( similarChar => <SimilarChar key={similarChar.id} char={similarChar} /> ) }
    </tbody>
  </table>)
}

class CharDetail extends Component {

  constructor( props ) {
    super( props )
    this.handleClose = this.handleClose.bind( this )
  }

  componentDidMount() {
    // animation seems to rerender everything.
    // no need for zenscroll anymore
    // this.zenscroll = zenscroll.createScroller( document.getElementById('letter') )
  }
  componentDidUpdate() {
    // this.zenscroll.toY(0)
  }

  handleClose( e ) {
    // don't close on nav link
    if ( e.target.nodeName === 'A' ) return
    // go back to the good listing
    const { char, history } = this.props
    const back = char.isNumber ? '/numbers' : char.isVowel ? '/vowels' : '/'
    history.push( back )
  }

  render() {
    const { char } = this.props
    let wrapperClasses = `letter-container`
    if ( char.isVowel ) wrapperClasses = `${wrapperClasses} is-vowel`
    return (
      <div id="letter" onClick={ this.handleClose }>
        <div className="content">
          <div className={wrapperClasses}>
            <strong className={`thai-letter ${char.longId }`}>{ char.letter }</strong>
            <p className="letter-meaning">
              <span className="letter-meaning-thai">{ char.thai }</span>
              <span className="letter-meaning-rtgs">{ char.rtgs }</span>
              <span className="letter-meaning-translation">{ char.meaning }</span>
            </p>
            <Pronunciation char={char} />
            <Variant variant={char.variant} />
            <SimilarHint similar={char.similar} />
          </div>
          <SimilarList similar={char.similar} />
        </div>
      </div>
    )
  }
}

const mapStateToProp = ( state, ownProps) => {
  const { longId }  = ownProps.match.params
  const { chars }   = state
  const char = chars.find( char => char.longId === longId )
  // maybe do a redirect here o_O ?
  if ( !char  ) return { back: true }

  const similar = ( char.get( 'similar' ) || crio([]) )
    .map( charId => chars.find( char => char.id === charId ) )
  return { char: char.setIn( 'similar', similar ) }
}

const CharDetailContainer = connect( mapStateToProp )( CharDetail )

export {
  CharDetailContainer as default,
}
