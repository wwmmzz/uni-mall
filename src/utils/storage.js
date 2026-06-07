const KEYS = {
  CART: 'UMALL_CART',
  FAVORITES: 'UMALL_FAVORITES',
  USER: 'UMALL_USER',
  ADDRESSES: 'UMALL_ADDRESSES',
  CHECKOUT_ITEMS: 'UMALL_CHECKOUT_ITEMS',
  CHECKOUT_ADDRESS: 'UMALL_CHECKOUT_ADDRESS',
  SELECTED_COUPON: 'UMALL_SELECTED_COUPON',
  ORDERS: 'UMALL_ORDERS',
  SEARCH_HISTORY: 'UMALL_SEARCH_HISTORY'
}

const defaultAddresses = [
  {
    id: 'addr_demo_1',
    name: '张三',
    phone: '13800138000',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    detail: '科技园示例大厦 18 楼',
    isDefault: true
  }
]

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

export function createId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`
}

export function formatDate(date = new Date()) {
  const pad = value => String(value).padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hour = pad(date.getHours())
  const minute = pad(date.getMinutes())

  return `${year}-${month}-${day} ${hour}:${minute}`
}

export function getCart() {
  return read(KEYS.CART, [])
}

export function saveCart(list) {
  write(KEYS.CART, list)
}

export function addToCart(product, sku = {}, quantity = 1) {
  const skuName = sku.skuName || '默认规格'
  const cartId = `${product.id}_${skuName}`
  const list = getCart()
  const target = list.find(item => item.cartId === cartId)

  if (target) {
    target.quantity += quantity
    target.checked = true
  } else {
    list.unshift({
      cartId,
      productId: product.id,
      title: product.title,
      price: product.price,
      oldPrice: product.oldPrice,
      cover: product.cover || '',
      coverText: product.coverText || '好物',
      gradient: product.gradient || '',
      skuName,
      quantity,
      checked: true
    })
  }

  saveCart(list)
  return list
}

export function removeCartItems(cartIds = []) {
  const ids = cartIds.map(String)
  const next = getCart().filter(item => !ids.includes(String(item.cartId)))
  saveCart(next)
  return next
}

export function getFavorites() {
  return read(KEYS.FAVORITES, [])
}

export function saveFavorites(list) {
  write(KEYS.FAVORITES, list)
}

export function isFavorite(productId) {
  return getFavorites().some(item => item.id === String(productId))
}

export function toggleFavorite(product) {
  const list = getFavorites()
  const index = list.findIndex(item => item.id === product.id)

  if (index >= 0) {
    list.splice(index, 1)
    saveFavorites(list)
    return false
  }

  list.unshift({
    id: product.id,
    title: product.title,
    price: product.price,
    oldPrice: product.oldPrice,
    cover: product.cover || '',
    coverText: product.coverText || '好物',
    gradient: product.gradient || '',
    tags: product.tags || []
  })

  saveFavorites(list)
  return true
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

export function getAddresses() {
  return read(KEYS.ADDRESSES, defaultAddresses)
}

export function saveAddresses(list) {
  write(KEYS.ADDRESSES, list)
}

export function getDefaultAddress() {
  const list = getAddresses()
  return list.find(item => item.isDefault) || list[0] || null
}

export function setDefaultAddress(id) {
  const list = getAddresses().map(item => ({
    ...item,
    isDefault: item.id === id
  }))
  saveAddresses(list)
  return list
}

export function getAddressById(id) {
  return getAddresses().find(item => item.id === id) || null
}

export function upsertAddress(address) {
  let list = getAddresses()
  const nextAddress = {
    ...address,
    id: address.id || createId('addr')
  }

  if (nextAddress.isDefault) {
    list = list.map(item => ({ ...item, isDefault: false }))
  }

  const index = list.findIndex(item => item.id === nextAddress.id)

  if (index >= 0) {
    list.splice(index, 1, nextAddress)
  } else {
    list.unshift(nextAddress)
  }

  if (!list.some(item => item.isDefault) && list.length) {
    list[0].isDefault = true
  }

  saveAddresses(list)
  return nextAddress
}

export function deleteAddress(id) {
  let list = getAddresses().filter(item => item.id !== id)

  if (!list.some(item => item.isDefault) && list.length) {
    list[0].isDefault = true
  }

  saveAddresses(list)
  return list
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
  write(KEYS.CHECKOUT_ITEMS, items)
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

export function getOrders() {
  return read(KEYS.ORDERS, [])
}

export function saveOrders(list) {
  write(KEYS.ORDERS, list)
}

export function addOrder(order) {
  const list = getOrders()
  list.unshift(order)
  saveOrders(list)
  return order
}

export function updateOrder(orderId, patch) {
  const list = getOrders()
  const index = list.findIndex(item => item.id === orderId)

  if (index >= 0) {
    list[index] = {
      ...list[index],
      ...patch
    }
    saveOrders(list)
    return list[index]
  }

  return null
}

export function getOrderById(orderId) {
  return getOrders().find(item => item.id === orderId) || null
}

export function createOrderNo() {
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
  return `UM${Date.now()}${random}`
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
