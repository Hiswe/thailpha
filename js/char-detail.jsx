import React from 'react'
import { connect } from 'react-redux'
import crio from 'crio'
import { Link } from 'react-router-dom'

import { Char } from './svg-symbol.jsx'

const AdditionalInfos = ({char}) => {
  const { pronunciation, isToneMark } = char
  if ( isToneMark ) {
    const { initialConsonant } = char
    return (
      <dl className="letter-additional-info">
        { Object.keys( initialConsonant ).map( key => {
          return ([
            <dt className="letter-additional-info__label">{ key }</dt>,
            <dd className="letter-additional-info__value">{ initialConsonant[ key ] }</dd>,
          ])
        }) }
      </dl>
    )
  }
  if ( !pronunciation ) return null
  if ( typeof pronunciation === 'string' ) {
    return (
      <div className="letter-additional-info">
        <span className="letter-additional-info__full">{ pronunciation }</span>
      </div>
    )
  }
  return (
    <dl className="letter-additional-info">
      <dt className="letter-additional-info__label">start</dt>
      <dd className="letter-additional-info__value">{ pronunciation.initial }</dd>
      <dt className="letter-additional-info__label">final</dt>
      <dd className="letter-additional-info__value">{ pronunciation.final }</dd>
      <dt className="letter-additional-info__label">class</dt>
      <dd className="letter-additional-info__value">{ char.class }</dd>
    </dl>
  )
}

const VariantChar = ({svgId}) => {
  return (
    <li className="letter-variant__item" key={ svgId }>
      <Char svgId={ svgId } additionalClass="thai-letter thai-letter--variant" />
    </li>
  )
}

const VariantList  = ({char}) => {
  const {variant, longId} = char
  if ( !variant ) return null
  const variantSvgID = variant.map( (v, i) => `${longId}-variant-${i}`)
  return (
    <ul className="letter-variant">
      { variantSvgID.map( svgId => <VariantChar svgId={ svgId } /> ) }
    </ul>
  )
}


const SimilarHint = ({similar}) => {
  if (!similar.length) return null
  return <p className="letter-hint">↓ similar ↓</p>
}

const SimilarChar = ({char}) => {
  return (
    <tr className="letter-similar__row">
      <td className="letter-similar__col thai-letter thai-letter--similar">
        <Link to={ `/char/${ char.longId }` }>
          <Char svgId={char.longId} />
        </Link>
      </td>
      <td className="letter-similar__col">{ char.rtgs }</td>
      <td className="letter-similar__col">{ char.pronunciation.initial }</td>
      <td className="letter-similar__col">{ char.pronunciation.final }</td>
    </tr>
  )
}

const SimilarList = ({similar}) => {
  if ( !similar.length ) return null
  return (
  <table className="letter-similar">
    <tbody>
      { similar.map( similarChar => <SimilarChar key={similarChar.id} char={similarChar} /> ) }
    </tbody>
  </table>)
}

class CharDetail extends React.Component {

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

  render() {
    const { char } = this.props
    let wrapperClasses = `letter-container`
    if ( char.hasVariant ) wrapperClasses = `${wrapperClasses} has-variant`
    if ( char.hasSimilar ) wrapperClasses = `${wrapperClasses} has-similar`
    return (
      <div id="letter">
        <div className="content">
          <div className={wrapperClasses}>
            <p className="letter-meaning">
              <span className="letter-meaning__rtgs">{ char.rtgs }</span>
              <span className="letter-meaning__thai">{ char.thai }</span>
              <span className="letter-meaning__translation">{ char.meaning }</span>
            </p>
            <Char svgId={char.longId} additionalClass="thai-letter thai-letter--principal" />
            <AdditionalInfos char={char} />
            <VariantList char={char} />
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
