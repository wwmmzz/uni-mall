export const banners = [
  {
    id: 'b1',
    title: '618 年中盛典',
    subtitle: '全场爆款低至 5 折',
    buttonText: '立即逛逛',
    gradient: 'linear-gradient(135deg, #ff7a45 0%, #ff2d55 100%)'
  },
  {
    id: 'b2',
    title: '数码新品首发',
    subtitle: '手机耳机限时立减',
    buttonText: '抢先看',
    gradient: 'linear-gradient(135deg, #4f8cff 0%, #8d5cff 100%)'
  },
  {
    id: 'b3',
    title: '品质生活馆',
    subtitle: '家居好物第二件半价',
    buttonText: '去发现',
    gradient: 'linear-gradient(135deg, #18c37d 0%, #12a1ff 100%)'
  }
]

export const categoryTabs = [
  { id: 'all', name: '全部' },
  { id: 'phone', name: '数码手机' },
  { id: 'beauty', name: '美妆护肤' },
  { id: 'food', name: '食品生鲜' },
  { id: 'home', name: '家居生活' },
  { id: 'sport', name: '运动户外' },
  { id: 'fashion', name: '服饰箱包' },
  { id: 'baby', name: '母婴玩具' }
]

export const categoryShortcuts = [
  { id: 'phone', name: '数码', icon: '📱' },
  { id: 'beauty', name: '美妆', icon: '💄' },
  { id: 'food', name: '生鲜', icon: '🍓' },
  { id: 'home', name: '家居', icon: '🏠' },
  { id: 'sport', name: '运动', icon: '🏃' },
  { id: 'fashion', name: '服饰', icon: '👟' },
  { id: 'baby', name: '母婴', icon: '🧸' },
  { id: 'all', name: '全部', icon: '✨' }
]

export const products = [
  {
    id: '1001',
    title: '云感轻薄手机 Pro 12+256G',
    desc: '旗舰芯片、超清影像、全天候长续航，适合日常办公和游戏娱乐。',
    category: 'phone',
    price: 3299,
    oldPrice: 3999,
    sales: 3268,
    stock: 996,
    badge: '新品',
    tags: ['12期免息', '顺丰包邮'],
    coverText: '轻薄手机',
    gradient: 'linear-gradient(135deg, #e6f0ff 0%, #b9d3ff 100%)',
    specs: ['星河银', '曜石黑', '冰川蓝']
  },
  {
    id: '1002',
    title: '智能主动降噪蓝牙耳机',
    desc: '深度降噪、通透模式、低延迟游戏模式，单次续航 8 小时。',
    category: 'phone',
    price: 399,
    oldPrice: 599,
    sales: 9841,
    stock: 1588,
    badge: '爆款',
    tags: ['降噪', '低延迟'],
    coverText: '降噪耳机',
    gradient: 'linear-gradient(135deg, #f1f4ff 0%, #d8c7ff 100%)',
    specs: ['云朵白', '深空灰']
  },
  {
    id: '1003',
    title: '氨基酸净润洁面乳 120g',
    desc: '温和清洁不紧绷，适合多种肤质，早晚均可使用。',
    category: 'beauty',
    price: 79,
    oldPrice: 129,
    sales: 12036,
    stock: 2220,
    badge: '热卖',
    tags: ['温和', '敏感肌可用'],
    coverText: '洁面乳',
    gradient: 'linear-gradient(135deg, #fff0f3 0%, #ffd6e1 100%)',
    specs: ['120g', '两支装']
  },
  {
    id: '1004',
    title: '水光修护精华液 30ml',
    desc: '补水保湿、改善干燥暗沉，打造通透水光肌。',
    category: 'beauty',
    price: 168,
    oldPrice: 239,
    sales: 5120,
    stock: 736,
    badge: '满减',
    tags: ['补水', '修护'],
    coverText: '精华液',
    gradient: 'linear-gradient(135deg, #f7f0ff 0%, #ead9ff 100%)',
    specs: ['30ml', '50ml']
  },
  {
    id: '1005',
    title: '海南金枕榴莲果肉 500g',
    desc: '冷链配送，果肉香甜绵密，开袋即食。',
    category: 'food',
    price: 99,
    oldPrice: 139,
    sales: 4538,
    stock: 430,
    badge: '冷链',
    tags: ['顺丰冷链', '产地直发'],
    coverText: '榴莲果肉',
    gradient: 'linear-gradient(135deg, #fff7d6 0%, #ffe08a 100%)',
    specs: ['500g', '1kg']
  },
  {
    id: '1006',
    title: '每日坚果混合装 30 包',
    desc: '甄选腰果、巴旦木、蔓越莓，每日一包营养加分。',
    category: 'food',
    price: 69,
    oldPrice: 99,
    sales: 8872,
    stock: 2810,
    badge: '囤货',
    tags: ['独立包装', '办公室零食'],
    coverText: '每日坚果',
    gradient: 'linear-gradient(135deg, #fff1df 0%, #ffd2a6 100%)',
    specs: ['30包', '60包']
  },
  {
    id: '1007',
    title: '北欧风可拆洗懒人沙发',
    desc: '高回弹填充，亲肤面料，可拆洗外套，小户型友好。',
    category: 'home',
    price: 499,
    oldPrice: 699,
    sales: 1456,
    stock: 338,
    badge: '家装节',
    tags: ['可拆洗', '小户型'],
    coverText: '懒人沙发',
    gradient: 'linear-gradient(135deg, #eef9f4 0%, #bfe9d5 100%)',
    specs: ['米白色', '雾霾蓝', '焦糖棕']
  },
  {
    id: '1008',
    title: '抗菌柔软四件套 1.8m 床',
    desc: 'A 类亲肤面料，柔软透气，四季皆宜。',
    category: 'home',
    price: 229,
    oldPrice: 329,
    sales: 3880,
    stock: 905,
    badge: '好评',
    tags: ['A类面料', '可机洗'],
    coverText: '四件套',
    gradient: 'linear-gradient(135deg, #f4fbff 0%, #c9ecff 100%)',
    specs: ['1.5m床', '1.8m床']
  },
  {
    id: '1009',
    title: '轻量缓震跑步鞋',
    desc: '轻量鞋身、回弹中底、防滑大底，日常通勤和慢跑皆可。',
    category: 'sport',
    price: 259,
    oldPrice: 399,
    sales: 6321,
    stock: 1188,
    badge: '运动季',
    tags: ['轻量', '缓震'],
    coverText: '跑步鞋',
    gradient: 'linear-gradient(135deg, #eef4ff 0%, #bfd8ff 100%)',
    specs: ['39码', '40码', '41码', '42码']
  },
  {
    id: '1010',
    title: '瑜伽健身垫加厚防滑',
    desc: '高密度材质，回弹舒适，居家训练更安心。',
    category: 'sport',
    price: 89,
    oldPrice: 129,
    sales: 2764,
    stock: 1640,
    badge: '包邮',
    tags: ['加厚', '防滑'],
    coverText: '瑜伽垫',
    gradient: 'linear-gradient(135deg, #f0fff6 0%, #b8efd1 100%)',
    specs: ['樱花粉', '湖水绿', '高级灰']
  },
  {
    id: '1011',
    title: '通勤大容量托特包',
    desc: '大容量分区，轻便耐磨，通勤、旅行都适合。',
    category: 'fashion',
    price: 159,
    oldPrice: 219,
    sales: 3310,
    stock: 780,
    badge: '上新',
    tags: ['大容量', '百搭'],
    coverText: '托特包',
    gradient: 'linear-gradient(135deg, #fff1f7 0%, #ffd3e4 100%)',
    specs: ['黑色', '棕色', '米白色']
  },
  {
    id: '1012',
    title: '儿童益智积木 120 件套',
    desc: '大颗粒设计，颜色丰富，锻炼动手能力和空间想象力。',
    category: 'baby',
    price: 129,
    oldPrice: 199,
    sales: 2988,
    stock: 920,
    badge: '亲子',
    tags: ['大颗粒', '益智'],
    coverText: '益智积木',
    gradient: 'linear-gradient(135deg, #fff8e9 0%, #ffd590 100%)',
    specs: ['基础款', '豪华款']
  }
]

export const coupons = [
  { id: 'c1', title: '新人专享券', amount: 20, threshold: 99, desc: '满 99 元可用', validDate: '领取后 7 天内有效' },
  { id: 'c2', title: '全场通用券', amount: 50, threshold: 299, desc: '满 299 元可用', validDate: '2026-12-31 前有效' },
  { id: 'c3', title: '数码品类券', amount: 100, threshold: 1999, desc: '数码手机类商品可用', validDate: '2026-12-31 前有效' }
]

export const orderTabs = [
  { id: 'all', name: '全部' },
  { id: 'unpaid', name: '待付款' },
  { id: 'paid', name: '待发货' },
  { id: 'shipped', name: '待收货' },
  { id: 'finished', name: '已完成' }
]

export const statusTextMap = {
  unpaid: '待付款',
  paid: '待发货',
  shipped: '待收货',
  finished: '已完成',
  closed: '已关闭'
}

export function getProductById(id) {
  return products.find(item => item.id === String(id)) || products[0]
}

export function getProductsByCategory(categoryId) {
  if (!categoryId || categoryId === 'all') {
    return products
  }

  return products.filter(item => item.category === categoryId)
}

export function searchProducts(keyword) {
  const value = String(keyword || '').trim().toLowerCase()

  if (!value) {
    return []
  }

  return products.filter(item => {
    const fields = [
      item.title,
      item.desc,
      item.category,
      ...(item.tags || []),
      ...(item.specs || [])
    ].join(' ').toLowerCase()

    return fields.includes(value)
  })
}

export function getHotProducts(limit = 6) {
  return [...products].sort((a, b) => b.sales - a.sales).slice(0, limit)
}

export function getNewProducts(limit = 6) {
  return products.slice(0, limit)
}
