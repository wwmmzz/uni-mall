import { request } from '@/utils/request.js'

export function getProducts(params = {}) {
  return request({
    url: '/products',
    data: params
  })
}

export function getHotProducts() {
  return request({
    url: '/products/hot'
  })
}

export function getNewProducts() {
  return request({
    url: '/products/new'
  })
}

export function getProductDetail(id) {
  return request({
    url: `/products/${id}`
  })
}
