'use strict'

const shell = require( `shelljs` )
const path  = require( `path` )
const fs    = require( `fs` )

const BRANCH      = `release`
const { version } = require( `../package.json` )

if ( !shell.which(`git`) ) {
  shell.echo( `Sorry, this script requires git` )
  shell.exit( 1 )
}

const currentBranch = shell.exec( `git branch`, {silent: true} ).grep( /^\*/ )
const branchName    = currentBranch.stdout.replace( /[\*\n\s]/g, `` )

if (branchName !== `master`) {
  shell.echo( `Sorry, you need to be on the master branch` )
  shell.exit( 1 )
}

////////
// DEPLOYING TO FIREBASE
////////

const firebaseDeploy = shell.exec(`yarn run firebase deploy`, {silent: true})
if ( firebaseDeploy.code !== 0 ) {
  shell.echo( `Unable deploy to firebase` )
  shell.echo( firebaseDeploy.stderr )
  shell.exit( 1 )
}

////////
// INITIALIZING FOLDERS & HELPERS
////////

const originalDir = shell.pwd()
const copydir     = shell.exec(`mktemp -d /tmp/thailpha.XXX`, {silent: true})
// stdout come with a linebreak. Remove it for better path joining
const copydirPath = copydir.stdout.replace(`\n`, ``)

const teardown = () => {
  shell.cd( originalDir )
  shell.rm( `-Rf`, copydir )
}

shell.echo( `temp dir will be created at: ${copydirPath}`)

////////
// COPYING FILES TO TMP
////////

shell.echo( `begin copy…` )

//----- GIT FILES

shell.echo( `…git files…` )
shell.cp( `-r`, `./.git/.`, path.join(copydirPath, `/.git`) )

//----- DIST FILES

shell.echo( `…dist files…` )
shell.cp( `-r`, `./dist/*`, copydir )
shell.echo( `…copy end` )
shell.cd( copydir )

////////
// GIT
////////

//----- SETTING A NEW BRANCH

shell.echo( `checking out ${BRANCH}` )

const tmpBranchName = `${BRANCH}-${version}`

// orphan branch for having a clean new branch
const gitCheckout = shell.exec( `git checkout --orphan ${tmpBranchName} `, {silent: true})
if (gitCheckout.code !== 0) {
  shell.echo( `Unable to checkout` )
  shell.echo(gitCheckout.stderr)
  teardown()
  shell.exit(1)
}

//----- ADDING THE FILES

shell.exec( `git add .`, {silent: true} )
shell.exec( `git commit -m "RELEASE – version ${version}"`, {silent: true} )

//----- PUSHING THE FILES

shell.echo( `pushing to gh-pages…` )
const ghPagePush = shell.exec( `git push origin ${tmpBranchName}:${BRANCH} --force`, {silent: true} )
if ( ghPagePush.code !== 0 ) {
  shell.echo( `Error: Git push failed` )
  shell.echo( ghPagePush.stderr )
  teardown()
  shell.exit( 1 )
} else {
  shell.echo( `…push done!` )
}

//----- TAGGING THE VERSION

shell.echo( `tagging version…` )
shell.exec( `git tag v${version}`, {silent: true} )
const tagPush = shell.exec( `git push --tags`, {silent: true} )
if ( tagPush.code !== 0 ) {
  shell.echo( `Error: Git tag push failed` )
  shell.echo( tagPush.stderr )
  teardown()
  shell.exit( 1 )
} else {
  shell.echo( `…tag push done!` )
}

// TEARDOW
teardown()
