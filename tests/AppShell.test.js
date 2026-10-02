import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App.vue'
import { useAuthStore } from '../src/stores/auth'

vi.mock('../src/api', () => ({ default: { post: vi.fn() } }))

import api from '../src/api'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

describe('App shell', () => {
  it('renders the login route outside the authenticated workspace chrome', () => {
    wrapper = mount(App, {
      global: {
        stubs: {
          RouterLink: {
            props: ['to'],
            template: '<a :href="to"><slot /></a>'
          },
          RouterView: { template: '<section>Login page</section>' }
        },
        mocks: {
          $router: { push: vi.fn() },
          $route: { path: '/login' }
        }
      }
    })

    expect(wrapper.find('.sidebar').exists()).toBe(false)
    expect(wrapper.find('.topbar').exists()).toBe(false)
    expect(wrapper.text()).toContain('Login page')
  })

  it('frames the workspace as an inventory desk with accessible primary navigation', () => {
    wrapper = mount(App, {
      global: {
        stubs: {
          RouterLink: {
            props: ['to'],
            template: '<a :href="to"><slot /></a>'
          },
          RouterView: { template: '<section>Page content</section>' }
        },
        mocks: {
          $router: { push: vi.fn() },
          $route: { path: '/dashboard' }
        }
      }
    })

    expect(wrapper.text()).toContain('Inventory desk')
    expect(wrapper.get('[aria-label="Primary inventory navigation"]').findAll('a')).toHaveLength(3)
  })

  it('exposes the inventory navigation and workspace, and logs out to login', async () => {
    const push = vi.fn()
    const removeItem = vi.fn()
    const localStorage = { getItem: vi.fn(() => null), setItem: vi.fn(), removeItem }
    vi.stubGlobal('localStorage', localStorage)
    const pinia = createPinia()
    const auth = useAuthStore(pinia)
    auth.setToken('session-token')
    api.post.mockResolvedValue({ data: { success: true, data: { logged_out: true } } })

    wrapper = mount(App, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: {
            props: ['to'],
            template: '<a :href="to"><slot /></a>'
          },
          RouterView: { template: '<section>Page content</section>' }
        },
        mocks: {
          $router: { push },
          $route: { path: '/dashboard' }
        }
      }
    })

    const navigation = wrapper.get('.nav')
    expect(navigation.findAll('a').map((link) => link.attributes('href'))).toEqual([
      '/dashboard', '/products', '/categories'
    ])
    expect(wrapper.get('section').text()).toContain('Page content')

    await wrapper.get('button').trigger('click')
    await vi.waitFor(() => expect(api.post).toHaveBeenCalledWith('/logout'))
    await vi.waitFor(() => expect(push).toHaveBeenCalledWith('/login'))
    expect(auth.token).toBe(null)
    expect(removeItem).toHaveBeenCalledWith('token')
  })

  it('clears the local session and returns to login when the logout API fails', async () => {
    const push = vi.fn()
    const localStorage = { getItem: vi.fn(() => null), setItem: vi.fn(), removeItem: vi.fn() }
    vi.stubGlobal('localStorage', localStorage)
    const pinia = createPinia()
    const auth = useAuthStore(pinia)
    auth.setToken('session-token')
    api.post.mockRejectedValue(new Error('Network unavailable'))

    wrapper = mount(App, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: {
            props: ['to'],
            template: '<a :href="to"><slot /></a>'
          },
          RouterView: { template: '<section>Page content</section>' }
        },
        mocks: {
          $router: { push },
          $route: { path: '/dashboard' }
        }
      }
    })

    await wrapper.get('button').trigger('click')
    await vi.waitFor(() => expect(push).toHaveBeenCalledWith('/login'))

    expect(api.post).toHaveBeenCalledWith('/logout')
    expect(auth.token).toBe(null)
    expect(localStorage.removeItem).toHaveBeenCalledWith('token')
  })
})
