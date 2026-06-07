<template>
  <view class="page result-page">
    <view class="result-card card">
      <view class="icon">{{ success ? '✅' : '⚠️' }}</view>
      <text class="title">{{ success ? '支付成功' : '支付未完成' }}</text>
      <text class="desc">
        {{ success ? '商家将尽快为你发货，请留意订单状态。' : '订单尚未完成支付，你可以稍后继续支付。' }}
      </text>

      <view v-if="orderId" class="order-no">
        <text>订单号</text>
        <text>{{ orderId }}</text>
      </view>

      <view class="actions">
        <view class="outline-btn" @click="goHome">返回首页</view>
        <view class="solid-btn" @click="goOrder">查看订单</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const status = ref('success')
const orderId = ref('')

const success = computed(() => status.value === 'success')

function goHome() {
  uni.switchTab({
    url: '/pages/home/index'
  })
}

function goOrder() {
  if (orderId.value) {
    uni.redirectTo({
      url: `/pages/order/detail?id=${orderId.value}`
    })
    return
  }

  uni.redirectTo({
    url: '/pages/order/list'
  })
}

onLoad(options => {
  status.value = options.status || 'success'
  orderId.value = options.orderId || ''
})
</script>

<style scoped lang="scss">
.result-page {
  padding: 80rpx 40rpx;
  background: linear-gradient(180deg, #fff2ef 0%, #f6f7fb 44%, #f6f7fb 100%);
}

.result-card {
  padding: 70rpx 34rpx 44rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon {
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
  background: #fff2ef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 78rpx;
}

.title {
  margin-top: 34rpx;
  color: #1f2430;
  font-size: 42rpx;
  font-weight: 900;
}

.desc {
  margin-top: 16rpx;
  color: #8a91a4;
  font-size: 26rpx;
  line-height: 40rpx;
  text-align: center;
}

.order-no {
  width: 100%;
  margin-top: 36rpx;
  padding: 22rpx;
  border-radius: 18rpx;
  background: #f7f8fb;
  display: flex;
  justify-content: space-between;
  color: #5d6475;
  font-size: 24rpx;
}

.order-no text:last-child {
  color: #1f2430;
  font-weight: 700;
}

.actions {
  width: 100%;
  margin-top: 48rpx;
  display: flex;
}

.outline-btn,
.solid-btn {
  flex: 1;
  height: 82rpx;
  border-radius: 42rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 800;
}

.outline-btn {
  margin-right: 18rpx;
  border: 1rpx solid #d8dde8;
  color: #5d6475;
}

.solid-btn {
  background: linear-gradient(135deg, #ff7a45 0%, #ff2d55 100%);
  color: #ffffff;
}
</style>
