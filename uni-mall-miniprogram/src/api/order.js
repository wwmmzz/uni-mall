import { request } from '@/utils/request.js'

export function getOrders(params = {}) {
  return request({
    url: '/orders',
    data: params
  })
}

export function getOrderDetail(orderNo) {
  return request({
    url: `/orders/${orderNo}`
  })
}

export function createOrder(data) {
  return request({
    url: '/orders',
    method: 'POST',
    data
  })
}

export function payOrder(orderNo) {
  return request({
    url: `/orders/${orderNo}/pay`,
    method: 'POST'
  })
}

export function cancelOrder(orderNo) {
  return request({
    url: `/orders/${orderNo}/cancel`,
    method: 'POST'
  })
}

export function finishOrder(orderNo) {
  return request({
    url: `/orders/${orderNo}/finish`,
    method: 'POST'
  })
}
