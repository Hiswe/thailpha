'use strict'

// https://github.com/mozilla/serviceworker-cookbook/blob/master/strategy-network-or-cache/service-worker.js

const CACHE_NAME  = 'cache-v1'
const TIMEOUT     = 400
const urlsToCache = [
  '/',
  '/?/',
  '/?/settings',
  '/index.html',
  '/thailpha.css',
  '/thailpha.js',
  '/thailpha-lib.js',
  '/index.html',

  '/touch-icon-icon-ipad.png',
  '/touch-icon-icon-iphone.png',
  '/touch-icon-ipad-retina.png',
  '/touch-icon-iphone-6-plus.png',
  '/touch-icon-iphone-retina.png',
]

const defer = () => {
  let res, rej
  const promise = new Promise((resolve, reject) => {
    res = resolve
    rej = reject
  })
  promise.resolve = res
  promise.reject  = rej
  return promise
}

const precache = () => {
  return caches
  .open( CACHE_NAME )
  .then( cache => {
    console.log( 'caching files…' )
    return cache.addAll( urlsToCache )
  })
  .then( cacheDone => {
    console.log( '…cache done!' )
  })
  .catch( err => {
    console.error( 'enable to open cache' )
    throw err
  })
}

// Time limited network request. If the network fails or the response is not
// served before timeout, the promise is rejected.
function fromNetwork(request, timeout = TIMEOUT) {
  const dfd       = defer()
  // Reject in case of timeout.
  const timeoutId = setTimeout( dfd.reject, timeout )
  // Fulfill in case of success.
  fetch( request )
  .then( response => {
    clearTimeout( timeoutId )
    dfd.resolve( response )
  })
  .catch( dfd.reject )

  return dfd
}

// Open the cache where the assets were stored and search for the requested
// resource. Notice that in case of no matching, the promise still resolves
// but it does with `undefined` as value.
const fromCache = request => {
  console.log( 'serving assets from cache' )
  return caches
  .open( CACHE_NAME )
  .then( cache => {
    return cache
    .match( request )
    .then( matching =>  matching || Promise.reject('no-match') )
  })
}

const onInstall = event => {
  console.log( 'Install done' )
  // Ask the service worker to keep installing until the returning promise
  // resolves.
  event.waitUntil( precache() )
}

// On fetch, use cache but update the entry with the latest contents
// from the server.
const onFetch = event => {
  const { request } = event
  console.log( 'The service worker is serving the asset.' )
  // Try network and if it fails, go for the cached copy.
  event.respondWith( fromNetwork(request).catch( () => fromCache(request) ) )

}

self.addEventListener( 'install', onInstall )
self.addEventListener( 'fetch', onFetch )
