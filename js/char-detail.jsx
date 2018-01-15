import { h, Component } from 'preact'
import { connect } from 'react-redux'
import crio from 'crio'
import { Link } from 'react-router-dom'

import { Char } from './svg-symbol.jsx'

const Pronunciation = ({char}) => {
  const { pronunciation } = char
  if ( !pronunciation ) return null
  if ( typeof pronunciation === 'string' ) {
    return (
      <div className="letter-pronunciation">
        <span className="letter-pronunciation__full">{ pronunciation }</span>
      </div>
    )
  }
  return (
    <dl className="letter-pronunciation">
      <dt className="letter-pronunciation__label">start</dt>
      <dd className="letter-pronunciation__value">{ pronunciation.initial }</dd>
      <dt className="letter-pronunciation__label">final</dt>
      <dd className="letter-pronunciation__value">{ pronunciation.final }</dd>
      <dt className="letter-pronunciation__label">class</dt>
      <dd className="letter-pronunciation__value">{ char.class }</dd>
    </dl>
  )
}

const Variant  = ({char}) => {
  const {variant, longId} = char
  if ( !variant ) return null
  const variantSvgID = variant.map( (v, i) => `${longId}-variant-${i}`)
  return (
    <ul className="letter-variant">
      { variantSvgID.map( (v) => <li className="thai-letter" key={ v }><Char svgId={v} /></li> ) }
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
        <Link to={ `/char/${ char.longId }` }>
          <Char svgId={char.longId} />
        </Link>
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
    this._onEsc = this._onEsc.bind( this )
  }

  componentWillMount() {
    document.addEventListener( 'keydown', this._onEsc )
  }

  componentWillUnmount() {
    document.removeEventListener( 'keydown', this._onEsc )
  }

  _onEsc( e ) {
    if ( e.key !== 'Escape' ) return
    const { history } = this.props
    history.goBack()
  }

  render( {char} ) {
    let wrapperClasses = `letter-container`
    if ( char.hasVariant ) wrapperClasses = `${wrapperClasses} has-variant`
    if ( char.hasSimilar ) wrapperClasses = `${wrapperClasses} has-similar`
    return (
      <div id="letter">
        <div className="content">
          <div className={wrapperClasses}>
            <p className="letter-meaning">
              <span className="letter-meaning__thai">{ char.thai }</span>
              <span className="letter-meaning__rtgs">{ char.rtgs }</span>
              <span className="letter-meaning__translation">{ char.meaning }</span>
            </p>
            <strong className={`thai-letter ${char.longId }`}>
              <Char svgId={char.longId} />
            </strong>
            <Pronunciation char={char} />
            <Variant char={char} />
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

  // expand the similarList with the full char
  const similar = char.get( 'similar' )
    .map( charId => chars.find( char => char.id === charId ) )
  return { char: char.set( 'similar', similar ) }
}

const CharDetailContainer = connect( mapStateToProp )( CharDetail )

export {
  CharDetailContainer as default,
}
