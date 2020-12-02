const version = '1.0.0'

self.addEventListener('install', event => {
  console.log('ServiceWorker: Installed version', version)
  /**
   * Cache assets when installing the service worker.
   *
   * @returns {Promise} Promise that resolves to undefined
   */
  const casheAssests = async () => {
    const cache = await self.caches.open(version)
    console.log('ServiceWorker:Caching Files')
    return cache.addAll([
      'index.html',
      'css/styles.css'
    ])
  }
  // wait until adding the files to the cache
  event.waitUntil(casheAssests())
})

self.addEventListener('activate', event => {
  console.log('ServiceWorker: Activated', version)
  /**
   * Delete old cache when changing the version.
   *
   * @returns {Promise} Promise that resolves to undefined
   */
  const remvoveCachedAssets = async () => {
    const cacheKeys = await caches.keys()

    return Promise.all(
      cacheKeys.map(cache => {
        if (cache !== version) {
          console.log('ServiceWorker: Clearing Cache', cache)
          return caches.delete(cache)
        }
        return undefined
      })
    )
  }

  event.waitUntil(remvoveCachedAssets())
})

self.addEventListener('fetch', event => {
  console.log('ServiceWorker: Fetching')
  console.log(event.request)
  /**
   * Cache the requested resources and when failing fetching from server, serve the resources from cache.
   *
   * @param {object} request - Request to fetch the resource
   * @returns {Promise} Promise that resolves to undefined
   */
  const cachedFetch = async request => {
    try {
      // try to fetch the asset from the server and if success, clone the result.
      const response = await fetch(request)

      // save the result in the cache
      const cache = await caches.open(version)
      cache.put(request, response.clone())
      return response
    } catch (error) {
      console.info('ServiceWorker: Serving cached result')
      return caches.match(request)
    }
  }
  event.respondWith(cachedFetch(event.request))
})
