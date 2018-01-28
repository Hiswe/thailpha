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
    "url": "/thailpha/200.html",
    "revision": "58f64f0ca60d7497f9ab9d5a49e0d7ef"
  },
  {
    "url": "/thailpha/index.html",
    "revision": "58f64f0ca60d7497f9ab9d5a49e0d7ef"
  },
  {
    "url": "/thailpha/launcher-icon-touch-icon-4x.png",
    "revision": "0f6f272a359fbbd4ba8cdfdefcd5ecf9"
  },
  {
    "url": "/thailpha/manifest.json",
    "revision": "adb0e25958ef7b52dd7045ac7ded74c3"
  },
  {
    "url": "/thailpha/svg-chars.svg",
    "revision": "07a87f46eae1d7f4ab130e6c2ef00559"
  },
  {
    "url": "/thailpha/thailpha-lib.js",
    "revision": "6ca7d894524a896ecd3e13037946437a"
  },
  {
    "url": "/thailpha/thailpha.css",
    "revision": "ac236a9c20dc64c2ac29d364fc3987c7"
  },
  {
    "url": "/thailpha/thailpha.js",
    "revision": "c053dbc950bc24fa5350ca9fbff8e26c"
  },
  {
    "url": "/thailpha/touch-icon-icon-ipad.png",
    "revision": "9f495681218827ba7d5ed377461b3368"
  },
  {
    "url": "/thailpha/touch-icon-icon-iphone.png",
    "revision": "f31adffed6ee06adaeee8fe872beb493"
  },
  {
    "url": "/thailpha/touch-icon-ipad-retina.png",
    "revision": "f2a99fa6e4487799e9f4a9759c53be80"
  },
  {
    "url": "/thailpha/touch-icon-iphone-6-plus.png",
    "revision": "b5e4d048b10bae648d11d5ac61561b68"
  },
  {
    "url": "/thailpha/touch-icon-iphone-retina.png",
    "revision": "60df61b5e9fdf1962d307301cd20b86b"
  },
  {
    "url": "/thailpha/touch-icon-web-app.png",
    "revision": "9b130ba47487399810af986cb39aea1e"
  }
];

const workboxSW = new self.WorkboxSW({
  "cacheId": "thailpha-cache-v3"
});
workboxSW.precache(fileManifest);
workboxSW.router.registerNavigationRoute("/thailpha/index.html", {
  whitelist: [/\/(vowels|numbers|about|search|char\/)/],
});
