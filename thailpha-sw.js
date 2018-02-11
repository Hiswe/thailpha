importScripts('workbox-sw.prod.v2.1.2.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */
const fileManifest = [
  {
    "url": "index.html",
    "revision": "35d9350c9ccf1fc36d679b5fdf8c62d9"
  },
  {
    "url": "launcher-icon-touch-icon-4x.png",
    "revision": "0f6f272a359fbbd4ba8cdfdefcd5ecf9"
  },
  {
    "url": "manifest.json",
    "revision": "3cfda9af78eb55883443e77883d960b0"
  },
  {
    "url": "svg-chars.svg",
    "revision": "fbe40fdbcc02d6246f7b0c21658ed73e"
  },
  {
    "url": "thailpha-lib.js",
    "revision": "cf6f3f79de8331592fa352b19373181e"
  },
  {
    "url": "thailpha.css",
    "revision": "91e047215d710bc6401226c362f404f3"
  },
  {
    "url": "thailpha.js",
    "revision": "f20e3cd8e5fc212d67cdbb056aba098f"
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
];

const workboxSW = new self.WorkboxSW({
  "cacheId": "thailpha-cache-v3"
});
workboxSW.precache(fileManifest);
workboxSW.router.registerNavigationRoute("/index.html", {
  whitelist: [/\/(vowels|numbers|about|search|char\/)/],
});
