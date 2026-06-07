import { request } from '@/utils/request.js'

export function getCoupons(params = {}) {
  return request({
    url: '/coupons',
    data: params
  })
}

export function claimCoupon(id) {
  return request({
    url: `/coupons/${id}/claim`,
    method: 'POST'
  })
}
