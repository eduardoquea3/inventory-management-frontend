import { describe, expect, it } from 'vitest'
import { normalizeApiError } from '../src/utils/apiError'

describe('API error normalization', () => {
  it('maps the standard invalid-credentials code to a clear login message', () => {
    const error = {
      response: {
        status: 401,
        data: {
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials.' }
        }
      }
    }

    expect(normalizeApiError(error).userMessage).toBe('Credenciales inválidas.')
  })

  it('preserves backend-specific conflict messages from the standard error envelope', () => {
    const error = {
      response: {
        status: 409,
        data: {
          success: false,
          error: { code: 'INSUFFICIENT_STOCK', message: 'Available stock is 3; requested 4.' }
        }
      }
    }

    expect(normalizeApiError(error).userMessage).toBe('Available stock is 3; requested 4.')
  })

  it('keeps the localized status fallback when a response has no error message', () => {
    const error = { response: { status: 422, data: { success: false, error: { code: 'VALIDATION_FAILED' } } } }

    expect(normalizeApiError(error).userMessage).toBe('Los datos enviados no son válidos.')
  })

  it('maps network failures without an HTTP response', () => {
    expect(normalizeApiError(new Error('offline')).userMessage).toBe('Error de red')
  })
})
