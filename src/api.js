import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = 'Bearer ' + token
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status
    const messages = {
      401: 'No autorizado. Iniciá sesión nuevamente.',
      403: 'No tenés permiso para realizar esta acción.',
      422: 'Los datos enviados no son válidos.',
      500: 'Ocurrió un error en el servidor.'
    }
    error.userMessage = status ? (messages[status] || `Error HTTP ${status}`) : 'Error de red'
    return Promise.reject(error)
  }
)

export default api
