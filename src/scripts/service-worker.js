/* eslint-disable */
'use strict';

// Manifest maintained in `cache-manifest.js`
// Populated by `sw` task
// Adapted from: https://github.com/GoogleChrome/sw-precache

var cacheManifest = [];
var ignoreUrlParametersMatching = [/^utm_/];

// Setup

// + (self.registration ? self.registration.scope : '');
var cacheName = 'dulmage-v1';

function addDirectoryIndex(originalUrl, index) {
  var url = new URL(originalUrl);

  if (url.pathname.slice(-1) === '/') {
    url.pathname += index;
  }

  return url.toString();
}

function cleanResponse(originalResponse) {
  // If this is not a redirected response, then we don't have to do anything.
  if (!originalResponse.redirected) {
    return Promise.resolve(originalResponse);
  }

  var bodyPromise = Promise.resolve(originalResponse.body);

  return bodyPromise.then(function(body) {
    return new Response(body, {
      headers: originalResponse.headers,
      status: originalResponse.status,
      statusText: originalResponse.statusText,
    });
  });
}

function createCacheKey(originalUrl, paramName, paramValue, dontCacheBustUrlsMatching) {
  // Create a new URL object to avoid modifying `originalUrl`
  var url = new URL(originalUrl);
  var hasMatch = url.pathname.match(dontCacheBustUrlsMatching);

  // If `dontCacheBustUrlsMatching` is not set, or if we don't have a match,
  // then add in the extra cache-busting URL parameter.
  if (!dontCacheBustUrlsMatching || !hasMatch) {
    var param = encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    url.search += (url.search ? '&' : '') + param;
  }

  return url.toString();
}

function stripIgnoredUrlParameters(originalUrl, ignoreUrlParametersMatching) {
  var url = new URL(originalUrl);

  // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
  url.hash = '';

  // Exclude initial '?'
  url.search = url.search
    .slice(1)
    // Split into an array of `key=value` strings
    .split('&')
    .map(function(kv) {
      // Split each `key=value` string into a [key, value] array
      return kv.split('=');
    })
    .filter(function(kv) {
      return ignoreUrlParametersMatching.every(function(ignoredRegex) {
        // Return `true` if the key doesn't match any of the regexes
        return !ignoredRegex.test(kv[0]);
      });
    })
    .map(function(kv) {
      // Join each [key, value] array into a `key=value` string
      return kv.join('=');
    })
    // Join the array of `key=value` strings into a string with `&` in between each
    .join('&');

  return url.toString();
}

function setOfCachedUrls(cache) {
  return cache
    .keys()
    .then(function(requests) {
      return requests.map(function(request) {
        return request.url;
      });
    })
    .then(function(urls) {
      return new Set(urls);
    });
}

// The new cache manifest

var hashParamName = '_dulmage';
var urlsToCacheKeys = new Map(
  cacheManifest.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  }),
);

// Service Worker events

function swUnregister() {
  self.oninstall = () => self.skipWaiting();

  self.addEventListener('activate', function(evt) {
    evt.waitUntil(
      caches
        .keys()
        .then(function(keyList) {
          return Promise.all(
            keyList.map(function(key) {
              return caches.delete(key);
            }),
          );
        })
        .then(function() {
          self.registration
            .unregister()
            .then(reg => {
              console.log('Service worker unregistered: ' + reg);
            })
            .catch(error => {
              throw Error('Error unregistering service worker: ' + error);
            });
        }),
    );
  });
}

function swInstall() {
  self.addEventListener('install', function(evt) {
    evt.waitUntil(
      caches
        .open(cacheName)
        .then(function(cache) {
          return setOfCachedUrls(cache).then(function(cachedUrls) {
            return Promise.all(
              Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
                // If we don't have a key matching url in the cache already, add it
                if (!cachedUrls.has(cacheKey)) {
                  var request = new Request(cacheKey, {credentials: 'same-origin'});
                  return fetch(request).then(function(response) {
                    // Bail out of installation unless we get back a 200 OK for every request
                    if (!response.ok) {
                      throw new Error(
                        'Request for ' +
                          cacheKey +
                          ' returned a ' +
                          'response with status ' +
                          response.status,
                      );
                    }

                    return cleanResponse(response).then(function(responseToCache) {
                      return cache.put(cacheKey, responseToCache);
                    });
                  });
                }
              }),
            );
          });
        })
        .then(function() {
          // Force the SW to transition from installing -> active state
          return self.skipWaiting();
        }),
    );
  });
}

function swActivate() {
  self.addEventListener('activate', function(evt) {
    var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

    evt.waitUntil(
      caches
        .open(cacheName)
        .then(function(cache) {
          return cache.keys().then(function(existingRequests) {
            return Promise.all(
              existingRequests.map(function(existingRequest) {
                if (!setOfExpectedUrls.has(existingRequest.url)) {
                  return cache.delete(existingRequest);
                }
              }),
            );
          });
        })
        .then(function() {
          return self.clients.claim();
        }),
    );
  });
}

function swFetch() {
  self.addEventListener('fetch', function(evt) {
    if (evt.request.method === 'GET') {
      // Should we call `evt.respondWith()` inside this fetch event handler?
      // This needs to be determined synchronously, which will give other fetch
      // handlers a chance to handle the request if need be.
      var shouldRespond;

      // First, remove all the ignored parameters and hash fragment, and see if we
      // have that URL in our cache. If so, great! `shouldRespond` will be `true`.
      var url = stripIgnoredUrlParameters(evt.request.url, ignoreUrlParametersMatching);
      shouldRespond = urlsToCacheKeys.has(url);

      // If `shouldRespond` is `false`, check again, this time with 'index.html'
      // (or whatever the directoryIndex option is set to) at the end.
      var directoryIndex = 'index.html';
      if (!shouldRespond && directoryIndex) {
        url = addDirectoryIndex(url, directoryIndex);
        shouldRespond = urlsToCacheKeys.has(url);
      }

      // If `shouldRespond` was set to `true` at any point, then call
      // `evt.respondWith()`, using the appropriate cache key.
      if (shouldRespond) {
        evt.respondWith(
          caches
            .open(cacheName)
            .then(function(cache) {
              return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
                if (response) {
                  return response;
                }

                throw Error('The cached response that was expected is missing.');
              });
            })
            .catch(function(e) {
              // Fall back to just fetch()ing the request if some unexpected error
              // prevented the cached response from being valid.
              console.warn('Couldn\'t serve response for "%s" from cache: %O', evt.request.url, e);
              return fetch(evt.request);
            }),
        );
      }
    }
  });
}

// Initialization
if (cacheManifest.length > 0) {
  swInstall();
  swActivate();
  swFetch();
} else {
  swUnregister();
}
