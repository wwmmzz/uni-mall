import { request } from '@/utils/request.js'

export function getAddressList() {
  return request({
    url: '/addresses'
  })
}

export function createAddress(data) {
  return request({
    url: '/addresses',
    method: 'POST',
    data
  })
}

export function updateAddress(id, data) {
  return request({
    url: `/addresses/${id}`,
    method: 'PATCH',
    data
  })
}

export function setDefaultAddress(id) {
  return request({
    url: `/addresses/${id}/default`,
    method: 'PATCH'
  })
}

export function deleteAddress(id) {
  return request({
    url: `/addresses/${id}`,
    method: 'DELETE'
  })
}
