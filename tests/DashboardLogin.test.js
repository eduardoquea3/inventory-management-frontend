import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Dashboard from '../src/views/Dashboard.vue'
import Login from '../src/views/Login.vue'

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
  vi.unstubAllGlobals()
})

describe('Dashboard and login flows', () => {
  it('renders dashboard metrics and activity from the standard API envelope', async () => {
    api.get.mockResolvedValue({
      data: {
        success: true,
        data: {
          products: 125,
          categories: 8,
          low_stock: [{ id: 2 }, { id: 5 }],
          last_movements: [{ id: 17, type: 'entrada', quantity: 12, reason: 'Restock' }]
        }
      }
    })

    wrapper = mount(Dashboard)
    await flushPromises()

    expect(api.get).toHaveBeenCalledWith('/dashboard')
    expect(wrapper.text()).toContain('125')
    expect(wrapper.text()).toContain('8')
    expect(wrapper.text()).toContain('2')
    expect(wrapper.text()).toContain('Restock')
  })

  it('shows the empty movement state when the dashboard has no activity', async () => {
    api.get.mockResolvedValue({
      data: {
        success: true,
        data: { products: 0, categories: 0, low_stock: [], last_movements: [] }
      }
    })

    wrapper = mount(Dashboard)
    await flushPromises()

    expect(wrapper.text()).toContain('Todavía no hay movimientos registrados.')
    expect(wrapper.text()).toContain('0 recientes')
  })

  it('shows dashboard API errors without presenting a false empty state', async () => {
    api.get.mockRejectedValue({ userMessage: 'Dashboard no disponible.' })

    wrapper = mount(Dashboard)
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toBe('Dashboard no disponible.')
    expect(wrapper.text()).not.toContain('Todavía no hay movimientos registrados.')
  })

  it('posts login credentials, saves the returned token, and navigates to the dashboard', async () => {
    const localStorage = { getItem: vi.fn(() => null), setItem: vi.fn() }
    const push = vi.fn()
    vi.stubGlobal('localStorage', localStorage)
    api.post.mockResolvedValue({ data: { token: 'session-token' } })

    wrapper = mount(Login, {
      global: {
        plugins: [createPinia()],
        mocks: { $router: { push } }
      }
    })
    await wrapper.get('#login-email').setValue('operator@example.test')
    await wrapper.get('#login-password').setValue('correct-horse')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(api.post).toHaveBeenCalledWith('/login', {
      email: 'operator@example.test',
      password: 'correct-horse'
    })
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'session-token')
    expect(push).toHaveBeenCalledWith('/dashboard')
  })

  it('shows the login API error and stays on the login route', async () => {
    const push = vi.fn()
    api.post.mockRejectedValue({ userMessage: 'Credenciales inválidas.' })

    wrapper = mount(Login, {
      global: {
        plugins: [createPinia()],
        mocks: { $router: { push } }
      }
    })
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toBe('Credenciales inválidas.')
    expect(push).not.toHaveBeenCalled()
  })
})
