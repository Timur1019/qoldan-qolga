let toastHandler = null

export function registerToastHandler(handler) {
  toastHandler = typeof handler === 'function' ? handler : null
}

export function notifyToast(type, message) {
  if (!message || !toastHandler) return
  toastHandler(type, message)
}
