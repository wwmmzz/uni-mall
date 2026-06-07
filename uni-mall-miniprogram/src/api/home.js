import { request } from '@/utils/request.js'

export function getHomeData() {
  return request({
    url: '/home'
  })
}

export function getCategories() {
  return request({
    url: '/categories'
  })
}
