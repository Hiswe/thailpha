import cloneDeep from 'lodash.clonedeep'
import React, { PureComponent, Fragment } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import SvgChar from '~/components/svg/char'
import ALL_CHARS from '~/models/dico-all.js'

const AdditionalInfos = props => {
  const { char } = props
  const { pronunciation, isToneMark } = char
  if (isToneMark) {
    const { initialConsonant } = char
    return (
      <dl className="letter-additional-info">
        {Object.keys(initialConsonant).map(key => {
          return (
            <Fragment>
              <dt className="letter-additional-info__label">{key}</dt>
              <dd className="letter-additional-info__value">
                {initialConsonant[key]}
              </dd>
            </Fragment>
          )
        })}
      </dl>
    )
  }
  if (!pronunciation) return null
  if (typeof pronunciation === 'string') {
    return (
      <div className="letter-additional-info">
        <span className="letter-additional-info__full">{pronunciation}</span>
      </div>
    )
  }
  return (
    <dl className="letter-additional-info">
      <dt className="letter-additional-info__label">start</dt>
      <dd className="letter-additional-info__value">{pronunciation.initial}</dd>
      <dt className="letter-additional-info__label">final</dt>
      <dd className="letter-additional-info__value">{pronunciation.final}</dd>
      <dt className="letter-additional-info__label">class</dt>
      <dd className="letter-additional-info__value">{char.class}</dd>
      {char.obsolete ? (
        <dt className="letter-additional-info__full">obsolete letter</dt>
      ) : null}
    </dl>
  )
}

const VariantChar = props => {
  const { svgId } = props
  return (
    <li className="letter-variant__item" key={svgId}>
      <SvgChar
        svgId={svgId}
        additionalClass="thai-letter thai-letter--variant"
      />
    </li>
  )
}

const VariantList = props => {
  const { char } = props
  const { variant, longId } = char
  if (!variant) return null
  const variantSvgID = variant.map((v, i) => `${longId}-variant-${i}`)
  return (
    <ul className="letter-variant">
      {variantSvgID.map(svgId => (
        <VariantChar key={svgId} svgId={svgId} />
      ))}
    </ul>
  )
}

const SimilarHint = props => {
  const { similar } = props
  if (!similar.length) return null
  return <p className="letter-hint">↓ similar ↓</p>
}

const SimilarChar = props => {
  const { char } = props
  const charUrl = { pathname: `/char/${char.longId}` }
  if (__IS_DEV__) charUrl.search = `?id=${char.id}`
  return (
    <tr className="letter-similar__row">
      <td className="letter-similar__col thai-letter thai-letter--similar">
        <Link to={charUrl}>
          <SvgChar svgId={char.longId} />
        </Link>
      </td>
      <td className="letter-similar__col">{char.rtgs}</td>
      <td className="letter-similar__col">
        {char.pronunciation && char.pronunciation.initial}
      </td>
      <td className="letter-similar__col">
        {char.pronunciation && char.pronunciation.final}
      </td>
    </tr>
  )
}

const SimilarList = props => {
  const { similar } = props
  if (!similar.length) return null
  return (
    <table className="letter-similar">
      <tbody>
        {similar.map(similarChar => (
          <SimilarChar key={similarChar.id} char={similarChar} />
        ))}
      </tbody>
    </table>
  )
}

export default class CharDetail extends PureComponent {
  constructor(props) {
    super(props)
    const { longId } = props.match.params

    const char = ALL_CHARS.find(char => char.longId === longId)
    // TODO: do something if no char
    // if (!char) return { back: true }

    const charWithSimilar = cloneDeep(char)
    // expand the similarList with the full char
    charWithSimilar.similar = charWithSimilar.similar.map(charId =>
      ALL_CHARS.find(char => char.id === charId)
    )
    this.state = {
      char: charWithSimilar,
    }
    this._onEsc = this._onEsc.bind(this)
  }

  componentWillMount() {
    document.addEventListener('keydown', this._onEsc)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this._onEsc)
  }

  _onEsc(e) {
    if (e.key !== 'Escape') return
    const { history } = this.props
    history.goBack()
  }

  render() {
    const { state } = this
    const { char } = state
    if (!char) return <p className="letter-not-found">character not found</p>
    const wrapperClasses = classNames(`letter-container`, {
      'has-variant': char.hasVariant,
      'has-similar': char.hasSimilar,
    })
    return (
      <div id="letter">
        <div className="content">
          <div className={wrapperClasses}>
            <p className="letter-meaning">
              <span className="letter-meaning__rtgs">{char.rtgs}</span>
              <span className="letter-meaning__thai">{char.thai}</span>
              <span className="letter-meaning__translation">
                {char.longMeaning}
              </span>
            </p>
            <SvgChar
              svgId={char.longId}
              additionalClass="thai-letter thai-letter--principal"
            />
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
