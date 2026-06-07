import { request } from '@/utils/request.js'

export function getFavorites() {
  return request({
    url: '/favorites'
  })
}

export function getFavoriteStatus(productId) {
  return request({
    url: `/favorites/${productId}`
  })
}

export function toggleFavorite(data) {
  return request({
    url: '/favorites/toggle',
    method: 'POST',
    data
  })
}
