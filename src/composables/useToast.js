// src/composables/useToast.js
import { ref } from 'vue'

const toast = ref({
  show: false,
  type: 'success',
  message: ''
})

let timeoutId = null

export function useToast() {
  const showToast = (type, message, duration = 3500) => {
    if (timeoutId) clearTimeout(timeoutId)
    
    toast.value = {
      show: true,
      type,
      message
    }
    
    timeoutId = setTimeout(() => {
      toast.value.show = false
    }, duration)
  }
  
  const hideToast = () => {
    if (timeoutId) clearTimeout(timeoutId)
    toast.value.show = false
  }
  
  return {
    toast,
    showToast,
    hideToast
  }
}