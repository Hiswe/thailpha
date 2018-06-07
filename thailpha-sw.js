/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js");

workbox.core.setCacheNameDetails({prefix: "thailpha-cache-v3"});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "index.html",
    "revision": "a821618211200ee7614f142ce5ce26e7"
  },
  {
    "url": "launcher-icon-touch-icon-4x.png",
    "revision": "0f6f272a359fbbd4ba8cdfdefcd5ecf9"
  },
  {
    "url": "manifest.json",
    "revision": "2dfe94611795728b52d5dcd61012d907"
  },
  {
    "url": "thailpha-lib.js",
    "revision": "be17778311ba5dd8573a69675985516b"
  },
  {
    "url": "thailpha.css",
    "revision": "15c1b699d7940c005864dfe9a342adfe"
  },
  {
    "url": "thailpha.js",
    "revision": "087f8ab9880e7d46d1d099b650cd6151"
  },
  {
    "url": "touch-icon-icon-ipad.png",
    "revision": "9f495681218827ba7d5ed377461b3368"
  },
  {
    "url": "touch-icon-icon-iphone.png",
    "revision": "f31adffed6ee06adaeee8fe872beb493"
  },
  {
    "url": "touch-icon-ipad-retina.png",
    "revision": "f2a99fa6e4487799e9f4a9759c53be80"
  },
  {
    "url": "touch-icon-iphone-6-plus.png",
    "revision": "b5e4d048b10bae648d11d5ac61561b68"
  },
  {
    "url": "touch-icon-iphone-retina.png",
    "revision": "60df61b5e9fdf1962d307301cd20b86b"
  },
  {
    "url": "touch-icon-web-app.png",
    "revision": "9b130ba47487399810af986cb39aea1e"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute("/index.html", {
  whitelist: [/\/(vowels|numbers|about|search|char\/)/],
  
});
