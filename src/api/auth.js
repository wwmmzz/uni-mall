import { request } from '@/utils/request.js'
import { setToken, setUser } from '@/utils/storage.js'

export async function mockLogin(data) {
  const res = await request({
    url: '/auth/mock-login',
    method: 'POST',
    data
  })

  setToken(res.accessToken)
  setUser(res.user)
  return res
}

export function getProfile() {
  return request({
    url: '/auth/profile'
  })
}
