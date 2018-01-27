<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Thailpha](#thailpha)
  - [Demo](#demo)
  - [sources](#sources)
    - [about transcription from Thai char to latin char](#about-transcription-from-thai-char-to-latin-char)
  - [For developpers](#for-developpers)
    - [Requirements](#requirements)
    - [Building](#building)
    - [Developement](#developement)
      - [building dependencies](#building-dependencies)
      - [server with livereload](#server-with-livereload)
      - [building for dev](#building-for-dev)
      - [dev static server](#dev-static-server)
      - [watching and recompiling](#watching-and-recompiling)
      - [all other commands](#all-other-commands)
    - [powered by](#powered-by)
    - [resources](#resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Thailpha

Thai alphabet webapp

## Demo

[https://thailpha-9e56f.firebaseapp.com/](https://thailpha-9e56f.firebaseapp.com/)

## sources

- http://www.thai-language.com <= this one one seems to be very exhaustive
- https://en.wikipedia.org/wiki/Thai_alphabet
- http://www.omniglot.com/writing/thai.htm
- https://www.thaialphabet.net

### about transcription from Thai char to latin char

quoting [thai-language.com](http://www.thai-language.com/ref/phonemic-transcription)

> There is no standardized romanization scheme for Thai, and many different schemes are in use by different texts and websites.

this apply to this webapp.

## For developpers 

### Requirements

- [node](http://nodejs.org/download/) >= 8.0.0
- GraphicsMagick `brew install graphicsmagick`
- [Allowing https on localhost](https://improveandrepeat.com/2016/09/allowing-self-signed-certificates-on-localhost-with-chrome-and-firefox/) with invalid certificates. (`chrome://flags/#allow-insecure-localhost` for chrome, add an exception for Firefox)
- optional: 
  - [yarn](https://yarnpkg.com/en/) every `npm/npx` command can be replaced with `yarn`
  - [git](https://git-scm.com/) and [git-lfs(https://git-lfs.github.com/)

### Building

```sh
npm install
npm start
```

all will be in the **dist** folder

### Developement

#### building dependencies

```sh
npm install
```

#### server with livereload


```sh
npm run dev
```

you can avoid to build the app by

```
npm run dev -- --no-build
```

#### building for dev

```sh
npm run build:dev
```

#### dev static server

```sh
npm run serve:dev
```

#### watching and recompiling

```sh
npm run watch
```

#### all other commands

see all commands with 

```sh
npx gulp --tasks
```

run a command (js for example)

```sh
npx gulp js
```

### powered by

- [nodeJs](https://nodejs.org/en/)
- [gulp](https://gulpjs.com/)
- [webpack](https://webpack.js.org/)
- [react](https://reactjs.org/)
- [redux](https://redux.js.org/)
- [crio](https://github.com/planttheidea/crio)
- [workbox](https://developers.google.com/web/tools/workbox/)

### resources

- write recognition https://dev.myscript.com/
