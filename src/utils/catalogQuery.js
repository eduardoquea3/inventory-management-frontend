const PRODUCT_SORT_FIELDS = new Set(['created_at', 'name', 'price', 'stock'])
const CATEGORY_SORT_FIELDS = new Set(['created_at', 'name'])
const SORT_DIRECTIONS = new Set(['asc', 'desc'])
const MAX_PER_PAGE = 100

function appendIfPresent(params, key, value) {
  if (value !== '' && value !== null && value !== undefined) {
    params.set(key, String(value))
  }
}

function appendSort(params, sortBy, sortDirection, allowedFields) {
  if (!allowedFields.has(sortBy)) return

  params.set('sort_by', sortBy)
  params.set('sort_direction', SORT_DIRECTIONS.has(sortDirection) ? sortDirection : 'asc')
}

function appendPagination(params, page, perPage) {
  const parsedPerPage = Number(perPage)
  params.set('page', String(Math.max(1, Number(page) || 1)))
  params.set('per_page', String(Math.min(MAX_PER_PAGE, Math.max(1, parsedPerPage || 15))))
}

export function buildProductsParams(filters) {
  const params = new URLSearchParams()
  appendPagination(params, filters.page, filters.perPage)

  for (const key of ['q', 'category_id', 'status', 'min_price', 'max_price', 'min_stock', 'max_stock']) {
    appendIfPresent(params, key, filters[key])
  }

  appendSort(params, filters.sort_by, filters.sort_direction, PRODUCT_SORT_FIELDS)
  return params
}

export function buildCategoriesParams(filters) {
  const params = new URLSearchParams()
  appendPagination(params, filters.page, filters.perPage)
  appendIfPresent(params, 'q', filters.q)
  appendIfPresent(params, 'status', filters.status)
  appendSort(params, filters.sort_by, filters.sort_direction, CATEGORY_SORT_FIELDS)
  return params
}

export function validateProductRanges(filters) {
  for (const [minimum, maximum, label] of [
    ['min_price', 'max_price', 'precio'],
    ['min_stock', 'max_stock', 'stock']
  ]) {
    const minValue = filters[minimum]
    const maxValue = filters[maximum]
    if (minValue === '' || maxValue === '' || minValue === null || maxValue === null) continue

    if (Number(minValue) > Number(maxValue)) {
      return `El valor mínimo de ${label} no puede superar al máximo.`
    }
  }

  return ''
}

export function readPaginatedResponse(responseData) {
  const pagination = responseData?.meta?.pagination ?? responseData?.meta ?? {}

  return {
    data: Array.isArray(responseData?.data) ? responseData.data : [],
    pagination: {
      currentPage: Math.max(1, Number(pagination.current_page) || 1),
      lastPage: Math.max(1, Number(pagination.last_page) || 1),
      perPage: Math.max(1, Number(pagination.per_page) || 15),
      total: Math.max(0, Number(pagination.total) || 0),
      from: pagination.from ?? null,
      to: pagination.to ?? null
    }
  }
}
