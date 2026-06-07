<template>
  <view class="page coupon-page safe-bottom">
    <view class="coupon-list">
      <view v-for="item in couponList" :key="item.id" class="coupon-card">
        <view class="amount-box">
          <text class="symbol">¥</text>
          <text class="amount">{{ item.amount }}</text>
        </view>

        <view class="info">
          <text class="title">{{ item.title }}</text>
          <text class="desc">{{ item.desc }}</text>
          <text class="date">{{ item.validDate }}</text>
        </view>

        <view class="use-btn" @click="selectCoupon(item)">
          {{ getButtonText(item) }}
        </view>
      </view>
    </view>

    <view class="tip">
      <text>说明：优惠券数据来自后端；结算页选择时会按当前商品金额计算是否可用。</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getCoupons, claimCoupon } from '@/api/coupon.js'
import { getCheckoutItems, requireLogin, setSelectedCoupon } from '@/utils/storage.js'

const mode = ref('normal')
const couponList = ref([])

function getQueryParams() {
  const items = getCheckoutItems()
  const goodsAmount = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0)
  const categories = [...new Set(items.map(item => item.category).filter(Boolean))]

  return {
    goodsAmount,
    ...(categories.length === 1 ? { categoryId: categories[0] } : {})
  }
}

async function loadCoupons() {
  if (!requireLogin()) {
    couponList.value = []
    return
  }

  couponList.value = await getCoupons(getQueryParams())
}

function getButtonText(item) {
  if (mode.value === 'select') {
    return item.usable ? '使用' : '不可用'
  }

  return item.status === 'unclaimed' ? '领取' : '已领取'
}

async function selectCoupon(item) {
  if (mode.value === 'select') {
    if (!item.usable) {
      uni.showToast({
        title: '当前订单不可使用该优惠券',
        icon: 'none'
      })
      return
    }

    setSelectedCoupon(item)

    uni.showToast({
      title: '已选择优惠券',
      icon: 'success'
    })

    setTimeout(() => {
      uni.navigateBack()
    }, 500)

    return
  }

  if (item.status === 'unclaimed') {
    await claimCoupon(item.id)
    await loadCoupons()
    uni.showToast({
      title: '领取成功',
      icon: 'success'
    })
    return
  }

  uni.showToast({
    title: '已领取',
    icon: 'none'
  })
}

onLoad(options => {
  mode.value = options.mode || 'normal'
})

onShow(() => {
  loadCoupons()
})
</script>

<style scoped lang="scss">
.coupon-page {
  padding: 24rpx;
}

.coupon-card {
  height: 190rpx;
  margin-bottom: 22rpx;
  border-radius: 24rpx;
  background: #ffffff;
  overflow: hidden;
  display: flex;
  align-items: center;
  box-shadow: 0 10rpx 30rpx rgba(31, 36, 48, 0.05);
}

.amount-box {
  width: 190rpx;
  height: 100%;
  background: linear-gradient(135deg, #ff7a45 0%, #ff2d55 100%);
  color: #ffffff;
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.symbol {
  font-size: 32rpx;
  font-weight: 800;
}

.amount {
  font-size: 70rpx;
  font-weight: 900;
}

.info {
  min-width: 0;
  flex: 1;
  padding: 0 22rpx;
  display: flex;
  flex-direction: column;
}

.title {
  color: #1f2430;
  font-size: 30rpx;
  font-weight: 900;
}

.desc {
  margin-top: 12rpx;
  color: #5d6475;
  font-size: 24rpx;
}

.date {
  margin-top: 10rpx;
  color: #a0a6b5;
  font-size: 22rpx;
}

.use-btn {
  width: 112rpx;
  height: 58rpx;
  margin-right: 22rpx;
  border-radius: 30rpx;
  background: #fff2ef;
  color: #ff4d3f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 800;
}

.tip {
  margin-top: 28rpx;
  padding: 24rpx;
  border-radius: 20rpx;
  background: #ffffff;
  color: #8a91a4;
  font-size: 24rpx;
  line-height: 38rpx;
}
</style>
