import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Login from '../src/views/Login.vue'

describe('Login view', () => {
  it('places the warehouse sign-in header at the top of its standalone page', () => {
    const wrapper = mount(Login)

    expect(wrapper.get('main > header').text()).toContain('Warehouse')
    expect(wrapper.get('main').element.firstElementChild.tagName).toBe('HEADER')

    wrapper.unmount()
  })

  it('provides explicitly labeled credentials fields', () => {
    const wrapper = mount(Login)

    const emailLabel = wrapper.get('label[for="login-email"]')
    const passwordLabel = wrapper.get('label[for="login-password"]')

    expect(emailLabel.text()).toContain('Email')
    expect(passwordLabel.text()).toContain('Password')
    expect(wrapper.get('#login-email').attributes('type')).toBe('email')
    expect(wrapper.get('#login-password').attributes('type')).toBe('password')

    wrapper.unmount()
  })
})
