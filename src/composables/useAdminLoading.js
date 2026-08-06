// src/admin/composables/useAdminLoading.js - Fixed with token-based tracking
import { ref, computed, readonly } from 'vue'

// Global loading state
const loadingState = ref({
  visible: false,
  title: 'Loading...',
  message: 'Please wait while we process your request.',
  icon: null,
  showProgress: false,
  progress: 0,
  progressLabel: 'Progress',
  showCancel: false,
  cancelText: 'Cancel',
  duration: 0,
  onCancel: null,
  onComplete: null
})

// Every in-flight "show" call gets its own token. The overlay stays visible
// as long as ANY token is still active. This is what actually fixes premature
// closing: a plain counter can be decremented by a hideLoading() call that
// belongs to a totally different operation (or a duplicate/mismatched call
// somewhere else in the app), silently pulling it to 0 while your fetch is
// still running. Tokens can only be removed by whoever holds them.
const activeTokens = new Set()
const timers = new Map() // token -> timeout id, for duration-based auto-hide

let tokenCounter = 0
const nextToken = () => `load_${Date.now()}_${++tokenCounter}`

export function useAdminLoading() {
  const isLoading = computed(() => loadingState.value.visible)

  const showLoading = (options = {}) => {
    const token = nextToken()
    activeTokens.add(token)
    console.log(`📊 Loading tokens active: ${activeTokens.size}`, [...activeTokens])

    // Update the visible modal's content. If something else is already
    // showing, this just refreshes the message on top of it.
    loadingState.value = {
      visible: true,
      title: options.title || 'Loading...',
      message: options.message || 'Please wait while we process your request.',
      icon: options.icon || null,
      showProgress: options.showProgress || false,
      progress: options.progress || 0,
      progressLabel: options.progressLabel || 'Progress',
      showCancel: options.showCancel || false,
      cancelText: options.cancelText || 'Cancel',
      duration: options.duration || 0,
      onCancel: options.onCancel || null,
      onComplete: options.onComplete || null
    }

    console.log('✅ Loading shown, token:', token)

    if (options.duration && options.duration > 0) {
      const timerId = setTimeout(() => {
        hideLoading(token)
        if (options.onComplete) {
          options.onComplete()
        }
      }, options.duration)
      timers.set(token, timerId)
    }

    // Callers should hold onto this token and pass it back to hideLoading().
    return token
  }

  const updateProgress = (progress, label = null) => {
    if (loadingState.value.visible && loadingState.value.showProgress) {
      loadingState.value.progress = Math.min(100, Math.max(0, progress))
      if (label) {
        loadingState.value.progressLabel = label
      }
    }
  }

  const hideLoading = (token) => {
    if (!token) {
      // No token supplied. We deliberately do NOT guess which operation
      // this call meant to close (e.g. "remove the oldest one") - a
      // mismatched or duplicate hideLoading() call from anywhere in the
      // app could then rip out an unrelated, still-active operation's
      // token and close the modal early. Every caller must hold onto the
      // token returned by showLoading() and pass it back here.
      console.warn('⚠️ hideLoading() called without a token - ignoring. Pass back the token returned by showLoading().')
      return
    }

    if (!activeTokens.has(token)) {
      // Already removed (e.g. duration timer + manual call both fired) or
      // a token from a stale/foreign call. Ignore it instead of letting it
      // corrupt the shared state.
      console.log(`⚠️ hideLoading called with unknown/expired token: ${token}`)
      return
    }

    activeTokens.delete(token)
    const timerId = timers.get(token)
    if (timerId) {
      clearTimeout(timerId)
      timers.delete(token)
    }

    console.log(`📊 Loading tokens remaining: ${activeTokens.size}`, [...activeTokens])

    if (activeTokens.size === 0) {
      loadingState.value.visible = false
      console.log('✅ Loading overlay hidden')
    } else {
      console.log(`⏳ Loading still in progress (${activeTokens.size} operation(s) remaining)`)
    }
  }

  // Force hide (use with caution - only for emergencies)
  const forceHideLoading = () => {
    for (const timerId of timers.values()) {
      clearTimeout(timerId)
    }
    timers.clear()
    activeTokens.clear()
    loadingState.value.visible = false
    console.log('⚠️ Loading overlay force hidden')
  }

  // Reset completely
  const resetLoading = () => {
    for (const timerId of timers.values()) {
      clearTimeout(timerId)
    }
    timers.clear()
    activeTokens.clear()
    loadingState.value = {
      visible: false,
      title: 'Loading...',
      message: 'Please wait while we process your request.',
      icon: null,
      showProgress: false,
      progress: 0,
      progressLabel: 'Progress',
      showCancel: false,
      cancelText: 'Cancel',
      duration: 0,
      onCancel: null,
      onComplete: null
    }
    console.log('🔄 Loading reset')
  }

  // Get current count of in-flight operations (for debugging)
  const getLoadingCounter = () => activeTokens.size

  return {
    loadingState: readonly(loadingState),
    isLoading: readonly(isLoading),
    showLoading,
    updateProgress,
    hideLoading,
    forceHideLoading,
    cancelLoading: hideLoading,
    resetLoading,
    getLoadingCounter
  }
}