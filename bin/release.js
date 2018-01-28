'use strict'

const shell = require( `shelljs` )
const path  = require( `path` )
const fs    = require( `fs` )

const { version } = require( `../package.json` )

if ( !shell.which(`git`) ) {
  shell.echo( `Sorry, this script requires git` )
  shell.exit( 1 )
}

const currentBranch = shell.exec( `git branch`, {silent: true}).grep(/^\*/)
const branchName    = currentBranch.stdout.replace(/[\*\n\s]/g, '')

if (branchName !== `master`) {
  shell.echo( `Sorry, you need to be on the master branch` )
  shell.exit( 1 )
}

const originalDir = shell.pwd()
const copydir     = shell.exec(`mktemp -d /tmp/thailpha.XXX`, {silent: true})
// stdout come with a linebreak. Remove it for better path joining
const copydirPath = copydir.stdout.replace('\n', '')

const teardown = () => {
  shell.cd( originalDir )
  shell.rm( `-Rf`, copydir )
}

shell.echo( `temp dir will be created at: ${copydirPath}`)

shell.echo( `begin copy…` )
shell.cp( `-r`, `./dist/.`, copydir )
shell.cp( `-r`, `./.git/.`, path.join(copydirPath, `/.git`) )
shell.echo( `…copy end` )
shell.cd( copydir )

shell.echo( `checking out gh-pages` )
shell.exec( `git checkout gh-pages -f`, {silent: true})
// shell.echo( shell.exec( `git branch`, {silent: true}).grep(/^\*/).stdout )

// GIT
// commits
shell.exec( `git add .`, {silent: true} )
shell.exec( `git commit -m "RELEASE – version ${version}"`, {silent: true} )
shell.echo( `pushing to gh-pages…` )
const ghPagePush = shell.exec( `git push origin gh-pages --force`, {silent: true} )
if ( ghPagePush.code !== 0 ) {
  shell.echo('Error: Git push failed')
  shell.echo(ghPagePush.stderr)
  teardown()
  shell.exit(1)
} else {
  shell.echo( `…push done!` )
}
// tags
shell.echo( `tagging version…` )
shell.exec( `git tag v${version}`, {silent: true} )
const tagPush = shell.exec( `git push --tags`, {silent: true} )
if ( tagPush.code !== 0 ) {
  shell.echo('Error: Git tag push failed')
  shell.echo(tagPush.stderr)
  teardown()
  shell.exit(1)
} else {
  shell.echo( `…tag push done!` )
}

// TEARDOW
teardown()
