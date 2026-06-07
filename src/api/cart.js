import { request } from '@/utils/request.js'

export function getCart() {
  return request({
    url: '/cart'
  })
}

export function addCartItem(data) {
  return request({
    url: '/cart/items',
    method: 'POST',
    data
  })
}

export function updateCartItem(id, data) {
  return request({
    url: `/cart/items/${id}`,
    method: 'PATCH',
    data
  })
}

export function removeCartItem(id) {
  return request({
    url: `/cart/items/${id}`,
    method: 'DELETE'
  })
}

export function checkAllCart(data) {
  return request({
    url: '/cart/check-all',
    method: 'PATCH',
    data
  })
}
