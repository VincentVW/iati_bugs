export const ENABLE_FULLSCREEN = 'ENABLE_FULLSCREEN'
function enableFullscreen() {
  return {
    type: ENABLE_FULLSCREEN,
    receivedAt: Date.now()
  }
}

export const DISABLE_FULLSCREEN = 'DISABLE_FULLSCREEN'
function disableFullscreen() {
  return {
    type: DISABLE_FULLSCREEN,
    receivedAt: Date.now()
  }
}
