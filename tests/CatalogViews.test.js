import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Categories from '../src/views/Categories.vue'
import ProductForm from '../src/views/ProductForm.vue'
import Products from '../src/views/Products.vue'

vi.mock('../src/api', () => ({
  default: Object.assign(vi.fn(), {
    get: vi.fn(),
    delete: vi.fn()
  })
}))

import api from '../src/api'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  api.mockReset()
  api.get.mockReset()
  api.delete.mockReset()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

const paginatedResponse = (data = [], pagination = {}) => ({
  data: {
    success: true,
    data,
    meta: {
      pagination: {
        current_page: 1,
        per_page: 15,
        total: data.length,
        last_page: 1,
        from: data.length ? 1 : null,
        to: data.length || null,
        ...pagination
      }
    }
  }
})

const mountView = (component, mocks = {}) => mount(component, {
  global: {
    mocks: { $route: { params: {} }, $router: { push: vi.fn() }, ...mocks },
    stubs: { RouterLink: true }
  }
})

describe('catalog views', () => {
  it('sends product filters, bounds, sorting, and pagination together', async () => {
    api.get.mockImplementation((url) => {
      if (url.startsWith('/categories')) {
        return Promise.resolve(paginatedResponse([{ id: 2, name: 'Keyboards' }]))
      }
      return Promise.resolve(paginatedResponse([{ id: 10, name: 'Desk keyboard', stock: 6 }]))
    })

    wrapper = mountView(Products)
    await flushPromises()

    const filters = wrapper.get('form[aria-label="Filtros de productos"]')
    await filters.get('input[placeholder="Buscar producto"]').setValue('keyboard')
    const selects = filters.findAll('select')
    await selects[0].setValue('2')
    await selects[1].setValue('1')
    await selects[2].setValue('price')
    await selects[3].setValue('desc')
    const bounds = filters.findAll('input[type="number"]')
    await bounds[0].setValue('10')
    await bounds[1].setValue('100')
    await bounds[2].setValue('2')
    await bounds[3].setValue('20')
    await filters.trigger('submit')
    await flushPromises()

    expect(api.get).toHaveBeenLastCalledWith(
      '/products?page=1&per_page=15&q=keyboard&category_id=2&status=1&min_price=10&max_price=100&min_stock=2&max_stock=20&sort_by=price&sort_direction=desc'
    )
    expect(wrapper.text()).toContain('Desk keyboard')
  })

  it('blocks product requests when a minimum exceeds its maximum', async () => {
    api.get.mockImplementation((url) => url.startsWith('/categories')
      ? Promise.resolve(paginatedResponse())
      : Promise.resolve(paginatedResponse([])))

    wrapper = mountView(Products)
    await flushPromises()
    const productRequestsBefore = api.get.mock.calls.filter(([url]) => url.startsWith('/products')).length
    const filters = wrapper.get('form[aria-label="Filtros de productos"]')
    const bounds = filters.findAll('input[type="number"]')
    await bounds[0].setValue('101')
    await bounds[1].setValue('100')
    await filters.trigger('submit')

    expect(wrapper.get('[role="alert"]').text()).toContain('precio')
    expect(api.get.mock.calls.filter(([url]) => url.startsWith('/products'))).toHaveLength(productRequestsBefore)
  })

  it('clamps an outdated product page to the last page and reloads there', async () => {
    api.get.mockImplementation((url) => {
      if (url.startsWith('/categories')) return Promise.resolve(paginatedResponse())
      const page = Number(new URLSearchParams(url.split('?')[1]).get('page'))
      return Promise.resolve(paginatedResponse([{ id: page, name: `Page ${page}` }], {
        current_page: Math.min(page, 2),
        total: 2,
        last_page: 2
      }))
    })

    wrapper = mountView(Products)
    await flushPromises()
    await wrapper.vm.changePage(4)
    await flushPromises()

    const productRequests = api.get.mock.calls.map(([url]) => url).filter(url => url.startsWith('/products'))
    expect(productRequests.slice(-2)).toEqual([
      '/products?page=4&per_page=15',
      '/products?page=2&per_page=15'
    ])
    expect(wrapper.vm.pagination.currentPage).toBe(2)
  })

  it('shows the product empty state for a valid empty API result', async () => {
    api.get.mockImplementation((url) => Promise.resolve(paginatedResponse([])))

    wrapper = mountView(Products)
    await flushPromises()

    expect(wrapper.text()).toContain('No se encontraron productos')
    expect(wrapper.get('form[aria-label="Filtros de productos"]')).toBeTruthy()
  })

  it('deletes a product and reloads the current catalog page', async () => {
    api.get.mockImplementation((url) => url.startsWith('/categories')
      ? Promise.resolve(paginatedResponse())
      : Promise.resolve(paginatedResponse([{ id: 10, name: 'Desk keyboard', stock: 6 }], { total: 1 })))
    api.delete.mockResolvedValue({ data: { success: true } })
    vi.stubGlobal('confirm', vi.fn(() => true))

    wrapper = mountView(Products)
    await flushPromises()
    await wrapper.get('tbody tr button').trigger('click')
    await flushPromises()

    expect(api.delete).toHaveBeenCalledWith('/products/10')
    expect(api.get.mock.calls.filter(([url]) => url.startsWith('/products'))).toHaveLength(2)
  })

  it('applies category text/status/sort filters and reads the nested envelope', async () => {
    api.get.mockResolvedValue(paginatedResponse([{ id: 3, name: 'Office supplies', status: 1 }]))

    wrapper = mountView(Categories)
    await flushPromises()
    const filters = wrapper.get('form[aria-label="Filtros de categorías"]')
    await filters.get('input').setValue('office')
    const selects = filters.findAll('select')
    await selects[0].setValue('1')
    await selects[1].setValue('name')
    await selects[2].setValue('asc')
    await filters.trigger('submit')
    await flushPromises()

    expect(api.get).toHaveBeenLastCalledWith('/categories?page=1&per_page=15&q=office&status=1&sort_by=name&sort_direction=asc')
    expect(wrapper.text()).toContain('Office supplies')
    expect(wrapper.text()).toContain('Activa')
  })

  it('clamps an outdated category page to the last page', async () => {
    api.get.mockImplementation((url) => {
      const page = Number(new URLSearchParams(url.split('?')[1]).get('page'))
      return Promise.resolve(paginatedResponse([{ id: page, name: `Category ${page}`, status: 1 }], {
        current_page: Math.min(page, 2),
        total: 2,
        last_page: 2
      }))
    })

    wrapper = mountView(Categories)
    await flushPromises()
    await wrapper.vm.changePage(4)
    await flushPromises()

    const categoryRequests = api.get.mock.calls.map(([url]) => url)
    expect(categoryRequests.slice(-2)).toEqual([
      '/categories?page=4&per_page=15',
      '/categories?page=2&per_page=15'
    ])
    expect(wrapper.vm.pagination.currentPage).toBe(2)
  })

  it('shows the category empty state for an empty API result', async () => {
    api.get.mockResolvedValue(paginatedResponse([]))

    wrapper = mountView(Categories)
    await flushPromises()

    expect(wrapper.text()).toContain('Todavía no hay categorías.')
  })

  it('creates, updates, and deletes categories through their CRUD actions', async () => {
    const category = { id: 9, name: 'Office', description: 'Stationery', status: 1 }
    api.get.mockResolvedValue(paginatedResponse([category]))
    api.mockResolvedValue({ data: { success: true } })
    api.delete.mockResolvedValue({ data: { success: true } })
    vi.stubGlobal('confirm', vi.fn(() => true))

    wrapper = mountView(Categories)
    await flushPromises()

    await wrapper.get('#category-name').setValue('Hardware')
    await wrapper.get('#category-description').setValue('Tools and equipment')
    await wrapper.get('section form').trigger('submit')
    await flushPromises()

    expect(api).toHaveBeenCalledWith({
      method: 'post',
      url: '/categories',
      data: {
        id: null,
        name: 'Hardware',
        description: 'Tools and equipment',
        status: 1
      }
    })

    await wrapper.get('tbody tr button').trigger('click')
    await wrapper.get('#category-name').setValue('Office supplies')
    await wrapper.get('section form').trigger('submit')
    await flushPromises()

    expect(api).toHaveBeenCalledWith({
      method: 'put',
      url: '/categories/9',
      data: { ...category, name: 'Office supplies' }
    })

    await wrapper.get('tbody tr button:last-of-type').trigger('click')
    await flushPromises()
    expect(api.delete).toHaveBeenCalledWith('/categories/9')
    expect(api.get).toHaveBeenCalledTimes(4)
  })

  it('loads all category pages into the product form selector and submits a new product', async () => {
    api.get.mockImplementation((_url, { params }) => Promise.resolve(params.page === 1
      ? paginatedResponse([{ id: 1, name: 'Office' }], { last_page: 2, total: 2 })
      : paginatedResponse([{ id: 2, name: 'Hardware' }], { current_page: 2, total: 2, from: 2, to: 2 })))
    api.mockResolvedValue({ data: { success: true } })

    wrapper = mountView(ProductForm)
    await flushPromises()
    expect(api.get).toHaveBeenNthCalledWith(1, '/categories', { params: { page: 1, per_page: 100 } })
    expect(api.get).toHaveBeenNthCalledWith(2, '/categories', { params: { page: 2, per_page: 100 } })
    expect(wrapper.get('#product-category').text()).toContain('Office')
    expect(wrapper.get('#product-category').text()).toContain('Hardware')

    await wrapper.get('#product-name').setValue('Wireless keyboard')
    await wrapper.get('#product-category').setValue('1')
    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(api).toHaveBeenCalledWith({
      method: 'post',
      url: '/products',
      data: {
        name: 'Wireless keyboard',
        description: '',
        price: '',
        stock: '',
        category_id: 1,
        status: 1
      }
    })
    expect(wrapper.text()).toContain('Guardado correctamente')
  })

  it('loads an existing product and submits edits to its resource endpoint', async () => {
    const existingProduct = {
      id: 5,
      name: 'Keyboard',
      description: 'Desk keyboard',
      price: 45,
      stock: 7,
      category_id: 1,
      status: 1
    }
    api.get.mockImplementation((url) => url === '/categories'
      ? Promise.resolve(paginatedResponse([{ id: 1, name: 'Office' }]))
      : Promise.resolve({ data: { success: true, data: existingProduct } }))
    api.mockResolvedValue({ data: { success: true } })
    const push = vi.fn()
    const setTimeout = vi.spyOn(globalThis, 'setTimeout').mockImplementation((callback) => {
      callback()
      return 0
    })

    wrapper = mountView(ProductForm, { $route: { params: { id: '5' } }, $router: { push } })
    await flushPromises()
    expect(wrapper.get('#product-name').element.value).toBe('Keyboard')

    await wrapper.get('#product-name').setValue('Mechanical keyboard')
    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(api).toHaveBeenCalledWith({
      method: 'put',
      url: '/products/5',
      data: { ...existingProduct, name: 'Mechanical keyboard' }
    })
    expect(push).toHaveBeenCalledWith('/products')
    setTimeout.mockRestore()
  })
})
