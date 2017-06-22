import * as api from '../api'

export const sendMessage = (msg) => ({
  type:'server/hello', 
  data:'Hello!'
})

export const nextStatus = () => ({
  type: 'NEXT',
})

export const resetStatus = () => ({
  type: 'RESET',
})

export const setSending = () => ({
  type: 'SET_SENDING'
})

export const setSent = () => ({
  type: 'SET_SENT'
})