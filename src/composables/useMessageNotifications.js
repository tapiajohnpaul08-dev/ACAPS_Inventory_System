// src/composables/useMessageNotifications.js
import { ref, computed } from 'vue'

// ── Module-level singleton state ────────────────────────────────────
const toasts           = ref([])
const enabled          = ref(true)   // sound toggle
const unreadSinceFocus = ref(0)      // count of new messages while tab is hidden

let toastIdCounter    = 0
let lastToastAt       = 0
const MIN_TOAST_INTERVAL = 3000      // max 1 toast per 3 seconds
const MAX_TOASTS         = 3         // cap the stack
const TOAST_DURATION     = 6000      // auto-dismiss in 6s

let flashInterval = null
let flashState    = false
let originalTitle = 'ACAPSHOP'

// ── Load persisted sound preference once ───────────────────────────
try {
  const saved = localStorage.getItem('messageSoundEnabled')
  if (saved === 'false') enabled.value = false
} catch {}

// ── Sound — Web Audio API (no asset file needed) ────────────────────
function playBeep() {
  if (!enabled.value) return
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const now = ctx.currentTime

    // Two-tone "ping" — friendly but short
    const tones = [
      { freq: 880,  start: 0,    dur: 0.08 },
      { freq: 1320, start: 0.09, dur: 0.10 },
    ]
    tones.forEach(({ freq, start, dur }) => {
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, now + start)
      gain.gain.linearRampToValueAtTime(0.12, now + start + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur)
      osc.connect(gain); gain.connect(ctx.destination)
      osc.start(now + start)
      osc.stop(now + start + dur + 0.02)
    })
    setTimeout(() => { try { ctx.close() } catch {} }, 500)
  } catch (e) {
    console.warn('Sound playback failed:', e)
  }
}

// ── Tab title flash ─────────────────────────────────────────────────
function startTitleFlash() {
  if (flashInterval) return
  originalTitle = document.title.replace(/^\(\d+\)\s*/, '') || 'ACAPSHOP'
  flashInterval = setInterval(() => {
    const n = unreadSinceFocus.value
    if (n === 0) { stopTitleFlash(); return }
    flashState = !flashState
    document.title = flashState
      ? `(${n}) New message — ACAPSHOP`
      : `New message — ACAPSHOP`
  }, 1500)
  document.title = `(${unreadSinceFocus.value}) New message — ACAPSHOP`
}

function stopTitleFlash() {
  if (flashInterval) { clearInterval(flashInterval); flashInterval = null }
  flashState = false
  unreadSinceFocus.value = 0
  document.title = originalTitle || 'ACAPSHOP'
}

// ── Composable ──────────────────────────────────────────────────────
export function useMessageNotifications() {
  const soundEnabled = computed({
    get: () => enabled.value,
    set: (v) => {
      enabled.value = !!v
      try { localStorage.setItem('messageSoundEnabled', enabled.value ? 'true' : 'false') } catch {}
    },
  })

  /**
   * Push a new message notification.
   * Returns the toast id, or null if suppressed by the rate limiter.
   */
  function notify({ conversationId, senderName, content, attachments = 0, createdAt }) {
    // Always bump the unread counter (drives tab title)
    unreadSinceFocus.value++
    if (typeof document !== 'undefined' && document.hidden) startTitleFlash()

    // Rate-limit toasts — at most 1 per 3s. Extra messages still
    // increment the tab title & sidebar badge, just no toast.
    const now = Date.now()
    if (now - lastToastAt < MIN_TOAST_INTERVAL) return null
    lastToastAt = now

    // Build preview
    let preview = (content || '').trim()
    if (!preview && attachments > 0) {
      preview = `📎 ${attachments} attachment${attachments > 1 ? 's' : ''}`
    }
    if (preview.length > 90) preview = preview.slice(0, 87) + '…'

    const toast = {
      id: ++toastIdCounter,
      conversationId,
      senderName: senderName || 'Customer',
      preview,
      createdAt: createdAt || new Date().toISOString(),
    }

    if (toasts.value.length >= MAX_TOASTS) toasts.value.shift()
    toasts.value.push(toast)

    setTimeout(() => dismiss(toast.id), TOAST_DURATION)
    playBeep()
    return toast.id
  }

  function dismiss(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function dismissAll() {
    toasts.value = []
  }

  function clearUnreadForConversation(conversationId) {
    toasts.value = toasts.value.filter((t) => t.conversationId !== conversationId)
  }

  function resetTabCounter() {
    stopTitleFlash()
  }

  return {
    toasts,
    soundEnabled,
    notify,
    dismiss,
    dismissAll,
    clearUnreadForConversation,
    resetTabCounter,
  }
}