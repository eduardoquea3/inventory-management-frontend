import { describe, expect, it } from 'vitest'
import {
  buildCategoriesParams,
  buildProductsParams,
  readPaginatedResponse,
  validateProductRanges
} from '../src/utils/catalogQuery'

const entries = (params) => Object.fromEntries(params.entries())

describe('catalog query helpers', () => {
  it('builds the supported product filters, sort, and pagination parameters', () => {
    const params = buildProductsParams({
      page: 1,
      perPage: 20,
      q: 'keyboard',
      category_id: 2,
      status: 1,
      min_price: 10,
      max_price: 100,
      min_stock: 1,
      max_stock: '',
      sort_by: 'price',
      sort_direction: 'asc'
    })

    expect(entries(params)).toEqual({
      page: '1',
      per_page: '20',
      q: 'keyboard',
      category_id: '2',
      status: '1',
      min_price: '10',
      max_price: '100',
      min_stock: '1',
      sort_by: 'price',
      sort_direction: 'asc'
    })
  })

  it('uses the API page defaults, caps page size, and omits unset filters', () => {
    expect(entries(buildProductsParams({ perPage: 500 }))).toEqual({
      page: '1',
      per_page: '100'
    })
  })

  it('omits unsupported sort fields and directions', () => {
    expect(entries(buildProductsParams({ sort_by: 'category_id', sort_direction: 'sideways' }))).toEqual({
      page: '1',
      per_page: '15'
    })
  })

  it('builds category filters and supported sorting parameters', () => {
    expect(entries(buildCategoriesParams({
      page: 2,
      perPage: 30,
      q: 'office',
      status: 0,
      sort_by: 'name',
      sort_direction: 'desc'
    }))).toEqual({
      page: '2',
      per_page: '30',
      q: 'office',
      status: '0',
      sort_by: 'name',
      sort_direction: 'desc'
    })
  })

  it('rejects reversed product price and stock ranges', () => {
    expect(validateProductRanges({ min_price: 101, max_price: 100 })).toContain('precio')
    expect(validateProductRanges({ min_stock: 8, max_stock: 2 })).toContain('stock')
    expect(validateProductRanges({ min_price: 10, max_price: 100, min_stock: 1, max_stock: 8 })).toBe('')
  })

  it('reads the standard nested pagination envelope', () => {
    expect(readPaginatedResponse({
      success: true,
      data: [{ id: 1 }],
      meta: {
        pagination: {
          current_page: 2,
          per_page: 15,
          total: 22,
          last_page: 2,
          from: 16,
          to: 22
        }
      }
    })).toEqual({
      data: [{ id: 1 }],
      pagination: {
        currentPage: 2,
        perPage: 15,
        total: 22,
        lastPage: 2,
        from: 16,
        to: 22
      }
    })
  })
})
