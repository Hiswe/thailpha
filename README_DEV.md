# thailpha – developer edition

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [requirements](#requirements)
- [dev stack](#dev-stack)
- [building](#building)
- [development](#development)
  - [building dependencies](#building-dependencies)
  - [server with livereload](#server-with-livereload)
  - [building for dev](#building-for-dev)
  - [dev static server](#dev-static-server)
  - [watching and recompiling](#watching-and-recompiling)
  - [all other commands](#all-other-commands)
  - [resources](#resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## requirements

- [node](http://nodejs.org/download/) >= 8.11.2
- GraphicsMagick `brew install graphicsmagick`
- [Allowing https on localhost](https://improveandrepeat.com/2016/09/allowing-self-signed-certificates-on-localhost-with-chrome-and-firefox/) with invalid certificates. (`chrome://flags/#allow-insecure-localhost` for chrome, add an exception for Firefox)
- optional: 
  - [yarn](https://yarnpkg.com/en/) every `npm/npx` command can be replaced with `yarn`
  - [git](https://git-scm.com/) and [git-lfs](https://git-lfs.github.com/)


## dev stack

- framework: [react](https://reactjs.org/)
- application state:
  - [redux](https://redux.js.org/)
  - [crio](https://github.com/planttheidea/crio)
- build tools:
  - [webpack](https://webpack.js.org/)
  - [gulp](https://gulpjs.com/)
- progressive web application: [workbox](https://developers.google.com/web/tools/workbox/)


## building

```sh
npm install
npm start
```

all will be in the **dist** folder

## development

### building dependencies

```sh
npm install
```

### server with livereload


```sh
npm run dev
```

you can avoid to build the app by

```
npm run dev -- --no-build
```

### building for dev

```sh
npm run build:dev
```

### dev static server

```sh
npm run serve:dev
```

### watching and recompiling

```sh
npm run watch
```

### all other commands

see all commands with 

```sh
npx gulp --tasks
```

run a command (js for example)

```sh
npx gulp js
```

### resources

- write recognition https://dev.myscript.com/
