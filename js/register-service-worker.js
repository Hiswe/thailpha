const BASE_CLASS = `pwa-refresh-ui`

function showRefreshUI(registration) {
  const refreshContainer = document.createElement(`div`)
  refreshContainer.classList.add(BASE_CLASS)

  const refreshText = document.createElement(`p`)
  refreshText.classList.add(`${BASE_CLASS}__text`)
  refreshText.textContent = `New version available`

  const dismissButton = document.createElement(`button`)
  dismissButton.classList.add(`${BASE_CLASS}__dismiss`)
  dismissButton.textContent = `dismiss`

  const refreshButton = document.createElement(`button`)
  refreshButton.classList.add(`${BASE_CLASS}__refresh`)
  refreshButton.textContent = `refresh`

  function removeRefreshUI() {
    refreshContainer.parentNode.removeChild(refreshContainer)
  }

  dismissButton.addEventListener(`click`, removeRefreshUI)

  refreshButton.addEventListener(`click`, () => {
    if (!registration.waiting) {
      // Just to ensure registration.waiting is available before
      // calling postMessage()
      return
    }
    // this will trigger the `controllerchange` event
    // console.log(`CALL SKIPWAITING`)
    registration.waiting.postMessage(`skipWaiting`)
    removeRefreshUI()
  })

  refreshContainer.appendChild(refreshText)
  refreshContainer.appendChild(dismissButton)
  refreshContainer.appendChild(refreshButton)
  document.body.appendChild(refreshContainer)
}

function onNewServiceWorker(registration, callback) {
  if (registration.waiting) {
    // SW is waiting to activate. Can occur if multiple clients open and
    // one of the clients is refreshed.
    return callback()
  }

  function listenInstalledStateChange() {
    // console.log(`SW: UPDATE FOUND`)
    registration.installing.addEventListener(`statechange`, event => {
      if (event.target.state === `installed`) {
        // A new service worker is available, inform the user
        callback()
      }
    })
  }

  if (registration.installing) {
    // console.log(`SW: REGISTRATION INSTALLING`)
    return listenInstalledStateChange()
  }

  // We are currently controlled so a new SW may be found...
  // Add a listener in case a new SW is found,
  registration.addEventListener(`updatefound`, listenInstalledStateChange)
}

// https://redfin.engineering/how-to-fix-the-refresh-button-when-using-service-workers-a8e27af6df68#06d3
function listenForWaitingServiceWorker(registration, callback) {
  function awaitStateChange() {
    registration.installing.addEventListener(`statechange`, function() {
      // console.log(`POUIC: statechange`)
      if (this.state === 'installed') callback(registration)
    })
  }
  if (!registration) {
    // console.log(`POUIC: no registration`)
    return
  }
  if (registration.waiting) {
    // console.log(`POUIC: waiting`)
    return callback(registration)
  }
  if (registration.installing) {
    // console.log(`POUIC: installing`)
    awaitStateChange()
  }
  registration.addEventListener(`updatefound`, () => {
    // console.log(`POUIC: update found`)
    awaitStateChange()
  })
}

function onRegistration(registration) {
  // Track updates to the Service Worker.
  if (!navigator.serviceWorker.controller) {
    // The window client isn't currently controlled so it's a new service
    // worker that will activate immediately
    // console.log(`NEW SERVICE WORKER: DO NOTHING`)
    return
  }

  // When the user asks to refresh the UI, we'll need to reload the window
  // console.log(`LISTEN TO CONTROLLER CHANGE`)
  let preventDevToolsReloadLoop = false
  navigator.serviceWorker.addEventListener(`controllerchange`, event => {
    // Ensure refresh is only called once.
    // This works around a bug in "force update on reload".
    if (preventDevToolsReloadLoop) {
      return
    }
    preventDevToolsReloadLoop = true
    // console.log(`Controller loaded`)
    window.location.reload()
  })

  listenForWaitingServiceWorker(registration, showRefreshUI)
}

if (`serviceWorker` in navigator) {
  window.addEventListener(`load`, () => {
    navigator.serviceWorker
      .register(`/${process.env.SW_NAME}`)
      .then(onRegistration)
  })
}
