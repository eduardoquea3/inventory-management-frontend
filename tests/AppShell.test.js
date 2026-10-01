import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App.vue'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  vi.unstubAllGlobals()
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
    vi.stubGlobal('localStorage', { removeItem })

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
    expect(removeItem).toHaveBeenCalledWith('token')
    expect(push).toHaveBeenCalledWith('/login')
  })
})
