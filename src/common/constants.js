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

export const categoryGradientMap = {
  all: 'linear-gradient(135deg, #ff7a45 0%, #ff2d55 100%)',
  phone: 'linear-gradient(135deg, #4f8cff 0%, #8d5cff 100%)',
  beauty: 'linear-gradient(135deg, #ff8ab3 0%, #ff5e8a 100%)',
  food: 'linear-gradient(135deg, #ffba52 0%, #ff7a45 100%)',
  home: 'linear-gradient(135deg, #18c37d 0%, #12a1ff 100%)',
  sport: 'linear-gradient(135deg, #41d18c 0%, #4f8cff 100%)',
  fashion: 'linear-gradient(135deg, #c45cff 0%, #ff5e8a 100%)',
  baby: 'linear-gradient(135deg, #ffd45c 0%, #ff9f52 100%)'
}

export const hotKeywords = ['手机', '耳机', '洁面', '坚果', '沙发', '跑步鞋']
