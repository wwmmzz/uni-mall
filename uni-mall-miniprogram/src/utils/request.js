import { clearAuth, getToken } from '@/utils/storage.js'

const BASE_URL = 'http://localhost:3000/api/v1'

function showError(message) {
  uni.showToast({
    title: Array.isArray(message) ? message[0] : message || '请求失败',
    icon: 'none'
  })
}

function redirectToLogin() {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]

  if (current?.route === 'pages/login/login') {
    return
  }

  setTimeout(() => {
    uni.navigateTo({
      url: '/pages/login/login'
    })
  }, 200)
}

export function request(options) {
  const token = getToken()

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}${options.url}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.header || {})
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
          return
        }

        const message = res.data?.message || '请求失败'

        if (res.statusCode === 401) {
          clearAuth()
          if (!options.skipAuthRedirect) {
            showError('登录状态已失效，请重新登录')
            redirectToLogin()
          }
        } else if (!options.silent) {
          showError(message)
        }

        reject({
          statusCode: res.statusCode,
          message: Array.isArray(message) ? message[0] : message,
          data: res.data
        })
      },
      fail(err) {
        if (!options.silent) {
          showError('网络异常')
        }

        reject({
          statusCode: 0,
          message: '网络异常',
          data: err
        })
      }
    })
  })
}
