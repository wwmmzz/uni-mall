const KEYS = {
  TOKEN: 'UMALL_TOKEN',
  USER: 'UMALL_USER',
  CHECKOUT_ITEMS: 'UMALL_CHECKOUT_ITEMS',
  CHECKOUT_ADDRESS: 'UMALL_CHECKOUT_ADDRESS',
  SELECTED_COUPON: 'UMALL_SELECTED_COUPON',
  SEARCH_HISTORY: 'UMALL_SEARCH_HISTORY'
}

function read(key, fallback) {
  try {
    const value = uni.getStorageSync(key)
    return value || fallback
  } catch (error) {
    console.warn('读取缓存失败', key, error)
    return fallback
  }
}

function write(key, value) {
  try {
    uni.setStorageSync(key, value)
  } catch (error) {
    console.warn('写入缓存失败', key, error)
  }
}

export function money(value) {
  return Number(value || 0).toFixed(2)
}

export function getToken() {
  return read(KEYS.TOKEN, '')
}

export function setToken(token) {
  if (!token) {
    uni.removeStorageSync(KEYS.TOKEN)
    return
  }

  write(KEYS.TOKEN, token)
}

export function getUser() {
  return read(KEYS.USER, null)
}

export function setUser(user) {
  if (!user) {
    uni.removeStorageSync(KEYS.USER)
    return
  }

  write(KEYS.USER, user)
}

export function clearAuth() {
  uni.removeStorageSync(KEYS.TOKEN)
  uni.removeStorageSync(KEYS.USER)
}

export function hasLogin() {
  return Boolean(getToken())
}

export function requireLogin() {
  if (hasLogin()) {
    return true
  }

  uni.showToast({
    title: '请先登录',
    icon: 'none'
  })

  setTimeout(() => {
    const pages = getCurrentPages()
    const current = pages[pages.length - 1]

    if (current?.route !== 'pages/login/login') {
      uni.navigateTo({
        url: '/pages/login/login'
      })
    }
  }, 200)

  return false
}

export function getCheckoutAddress() {
  return read(KEYS.CHECKOUT_ADDRESS, null)
}

export function setCheckoutAddress(address) {
  if (!address) {
    uni.removeStorageSync(KEYS.CHECKOUT_ADDRESS)
    return
  }

  write(KEYS.CHECKOUT_ADDRESS, address)
}

export function getCheckoutItems() {
  return read(KEYS.CHECKOUT_ITEMS, [])
}

export function setCheckoutItems(items) {
  write(KEYS.CHECKOUT_ITEMS, items || [])
}

export function clearCheckoutItems() {
  uni.removeStorageSync(KEYS.CHECKOUT_ITEMS)
}

export function getSelectedCoupon() {
  return read(KEYS.SELECTED_COUPON, null)
}

export function setSelectedCoupon(coupon) {
  if (!coupon) {
    uni.removeStorageSync(KEYS.SELECTED_COUPON)
    return
  }

  write(KEYS.SELECTED_COUPON, coupon)
}

export function getSearchHistory() {
  return read(KEYS.SEARCH_HISTORY, [])
}

export function addSearchHistory(keyword) {
  const value = String(keyword || '').trim()

  if (!value) {
    return getSearchHistory()
  }

  const list = getSearchHistory().filter(item => item !== value)
  list.unshift(value)

  const next = list.slice(0, 10)
  write(KEYS.SEARCH_HISTORY, next)
  return next
}

export function clearSearchHistory() {
  write(KEYS.SEARCH_HISTORY, [])
}
