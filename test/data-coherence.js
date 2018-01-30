'use strict'

import test  from 'ava'
import path from 'path'
import fs from 'fs-extra'

import chars from '../js/models/dico-all'

function testPath( longId, variant = `` ) {
  variant = typeof variant === `number` ? `-variant-${variant}` : variant
  const svgPath = `../characters/${longId}${variant}.svg`
  return fs.pathExistsSync( path.join(__dirname, svgPath) )
}

test('test coherence', t => {
  chars.forEach( char => {
    const { similar, longId, variant } = char
    // don't reference an unexisting id
    if (Array.isArray(similar) && similar.length ) {
      similar.forEach( charId => {
        t.truthy( chars.find( c => c.id === charId) )
      })
    }
    // check the existence of the right svg file
    t.true( testPath( longId ) )
    // and his variants
    if (Array.isArray(variant) && variant.length ) {
      variant.forEach( (c, index) => {
        t.true( testPath( longId, index ) )
      })
    }
  })
})
