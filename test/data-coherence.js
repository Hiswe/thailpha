'use strict'

import test  from 'ava'
import path from 'path'
import fs from 'fs-extra'

import chars from '../js/models/dico-all'

function testPath( longId, variant = `` ) {
  variant = typeof variant === `number` ? `-variant-${variant}` : variant
  const svgPath = `../characters/${longId}${variant}.svg`
  return fs.pathExists( path.join(__dirname, svgPath) )
}

// https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const testCoherence = async t => {
  await asyncForEach( chars, async char => {
    const { similar, longId, variant } = char

    // don't reference an unexisting id
    if (Array.isArray(similar) && similar.length ) {
      similar.forEach( charId => {
        const charSearch  = chars.find( c => c.id === charId)
        const charFound   = typeof charSearch !== `undefined`
        t.true( charFound, `${longId} similar ${charId} test` )
      })
    }

    // check the existence of the right svg file
    const svgCharExist = await testPath( longId )
    t.true( svgCharExist, `${longId} SVG test` )

    // and his variants
    if (Array.isArray(variant) && variant.length ) {
      await asyncForEach( variant, async (c, index) => {
        const svgVariant = await testPath( longId, index )
        t.true( svgVariant, `${longId} variant ${index} SVG test` )
      })
    }
  })
}

test('test coherence', testCoherence)
