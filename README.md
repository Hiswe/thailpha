# Thailpha

Thai alphabet webapp

## Demo

[https://thailpha-9e56f.firebaseapp.com/](https://thailpha-9e56f.firebaseapp.com/)

## Requirements:

- [node](http://nodejs.org/download/) >= 8.0.0
- GraphicsMagick `brew install graphicsmagick`

## Building

```sh
npm install
npm run build
open public/index.html
```

all will be in the **dist** folder

## Developement

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

# resources

- https://dev.myscript.com/
