// src/composables/useGlobalDropZone.js
import { ref } from 'vue'

// ── Module-level singleton state ────────────────────────────────────
const isDragging   = ref(false)
const dropHandlers = ref([])   // [{ id, accept, handler }]
const lastMessage  = ref('')

let dragDepth   = 0
let initialized = false

function _hasFiles(e) {
  return e.dataTransfer?.types?.includes('Files')
}

function onDragEnter(e) {
  if (!_hasFiles(e)) return
  e.preventDefault()
  dragDepth++
  if (dragDepth === 1) isDragging.value = true
}

function onDragOver(e) {
  if (!_hasFiles(e)) return
  e.preventDefault()
  e.dataTransfer.dropEffect = 'copy'
}

function onDragLeave(e) {
  if (!_hasFiles(e)) return
  e.preventDefault()
  dragDepth = Math.max(0, dragDepth - 1)
  if (dragDepth === 0) isDragging.value = false
}

function onDrop(e) {
  if (!_hasFiles(e)) return
  e.preventDefault()
  dragDepth = 0
  isDragging.value = false

  const files = e.dataTransfer.files
  if (!files || files.length === 0) return

  // Last registered target wins (top-most modal, etc.)
  const target = dropHandlers.value[dropHandlers.value.length - 1]
  if (!target) return
  target.handler(files)
}

/**
 * Wire the window listeners. Call EXACTLY ONCE, from DragDropOverlay.
 * Guarded so double-init is a no-op.
 */
function init() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  window.addEventListener('dragenter', onDragEnter)
  window.addEventListener('dragover',  onDragOver)
  window.addEventListener('dragleave', onDragLeave)
  window.addEventListener('drop',      onDrop)
}

function destroy() {
  if (!initialized) return
  initialized = false
  window.removeEventListener('dragenter', onDragEnter)
  window.removeEventListener('dragover',  onDragOver)
  window.removeEventListener('dragleave', onDragLeave)
  window.removeEventListener('drop',      onDrop)
  dragDepth = 0
  isDragging.value = false
  dropHandlers.value = []
}

export function useGlobalDropZone() {
  /**
   * Register a drop target. Returns an unregister function — CALL IT on
   * unmount / when the target closes, otherwise the handler leaks.
   */
  function registerDropTarget(opts) {
    dropHandlers.value = dropHandlers.value.filter((h) => h.id !== opts.id)
    dropHandlers.value.push(opts)
    return () => {
      dropHandlers.value = dropHandlers.value.filter((h) => h.id !== opts.id)
    }
  }

  return { isDragging, registerDropTarget, lastMessage, init, destroy }
}