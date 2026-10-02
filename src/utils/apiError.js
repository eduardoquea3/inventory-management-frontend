const statusMessages = {
  401: 'No autorizado. Iniciá sesión nuevamente.',
  403: 'No tenés permiso para realizar esta acción.',
  422: 'Los datos enviados no son válidos.',
  500: 'Ocurrió un error en el servidor.'
}

const apiCodeMessages = {
  INVALID_CREDENTIALS: 'Credenciales inválidas.',
  UNAUTHENTICATED: statusMessages[401],
  VALIDATION_FAILED: statusMessages[422]
}

export function normalizeApiError(error) {
  const status = error.response?.status
  const apiError = error.response?.data?.error
  const message = apiCodeMessages[apiError?.code]
    || apiError?.message
    || error.response?.data?.message

  error.userMessage = message
    || (status ? (statusMessages[status] || `Error HTTP ${status}`) : 'Error de red')

  return error
}
