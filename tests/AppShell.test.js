import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App.vue'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  vi.unstubAllGlobals()
})

describe('App shell', () => {
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
        mocks: { $router: { push } }
      }
    })

    const navigation = wrapper.get('nav[aria-label="Main navigation"]')
    expect(navigation.findAll('a').map((link) => link.attributes('href'))).toEqual([
      '/dashboard', '/products', '/categories'
    ])
    expect(wrapper.get('main').text()).toContain('Page content')

    await wrapper.get('button').trigger('click')
    expect(removeItem).toHaveBeenCalledWith('token')
    expect(push).toHaveBeenCalledWith('/login')
  })
})
