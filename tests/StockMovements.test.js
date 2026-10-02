import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import StockMovements from '../src/views/StockMovements.vue'

vi.mock('../src/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}))

import api from '../src/api'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  vi.clearAllMocks()
})

const mountView = () => mount(StockMovements, {
  global: {
    mocks: { $route: { params: { id: '42' } } },
    stubs: { RouterLink: true }
  }
})

describe('StockMovements view', () => {
  it('renders rows from the documented stock movement response envelope', async () => {
    api.get.mockResolvedValue({
      data: {
        success: true,
        data: [{
          id: 7,
          product_id: 42,
          type: 'entrada',
          quantity: 12,
          reason: 'Restock',
          user_id: 3,
          created_at: '2026-10-01T10:00:00Z',
          updated_at: '2026-10-01T10:00:00Z'
        }]
      }
    })

    wrapper = mountView()
    await vi.waitFor(() => expect(wrapper.text()).toContain('Restock'))

    expect(wrapper.text()).toContain('7')
    expect(wrapper.text()).toContain('entrada')
    expect(wrapper.text()).toContain('12')
    expect(wrapper.text()).toContain('1 registros')
    expect(api.get).toHaveBeenCalledWith('/products/42/stock-movements')
  })

  it('posts a movement and refreshes the history after a successful save', async () => {
    api.get
      .mockResolvedValueOnce({ data: { success: true, data: [] } })
      .mockResolvedValueOnce({
        data: {
          success: true,
          data: [{
            id: 8,
            product_id: 42,
            type: 'salida',
            quantity: 2,
            reason: 'Damaged',
            user_id: 3,
            created_at: '2026-10-01T10:00:00Z',
            updated_at: '2026-10-01T10:00:00Z'
          }]
        }
      })
    api.post.mockResolvedValue({ data: { success: true } })

    wrapper = mountView()
    await vi.waitFor(() => expect(api.get).toHaveBeenCalledTimes(1))
    await wrapper.get('#movement-type').setValue('salida')
    await wrapper.get('#movement-quantity').setValue('2')
    await wrapper.get('#movement-reason').setValue('Damaged')
    await wrapper.get('form').trigger('submit')

    await vi.waitFor(() => expect(wrapper.text()).toContain('Damaged'))
    expect(api.post).toHaveBeenCalledWith('/products/42/stock-movements', {
      type: 'salida',
      quantity: 2,
      reason: 'Damaged'
    })
    expect(api.get).toHaveBeenCalledTimes(2)
    expect(wrapper.text()).toContain('Movimiento registrado.')
  })

  it('rejects a non-positive quantity without posting', async () => {
    api.get.mockResolvedValue({ data: { success: true, data: [] } })

    wrapper = mountView()
    await vi.waitFor(() => expect(api.get).toHaveBeenCalledTimes(1))
    await wrapper.get('#movement-quantity').setValue('0')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.get('[role="alert"]').text()).toContain('mayor que cero')
    expect(api.post).not.toHaveBeenCalled()
  })
})
