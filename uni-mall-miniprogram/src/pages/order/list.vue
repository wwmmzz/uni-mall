<template>
  <view class="page order-list-page safe-bottom">
    <scroll-view class="tabs" scroll-x show-scrollbar="false">
      <view
        v-for="tab in orderTabs"
        :key="tab.id"
        class="tab"
        :class="{ active: activeStatus === tab.id }"
        @click="activeStatus = tab.id"
      >
        {{ tab.name }}
      </view>
    </scroll-view>

    <view v-if="filteredOrders.length" class="order-list">
      <view v-for="order in filteredOrders" :key="order.id" class="order-card card">
        <view class="order-head" @click="goDetail(order)">
          <text class="shop">优选商城自营</text>
          <text class="status">{{ statusTextMap[order.status] || order.statusText }}</text>
        </view>

        <view
          v-for="item in order.items.slice(0, 2)"
          :key="item.productId + item.skuName"
          class="goods-row"
          @click="goDetail(order)"
        >
          <view class="cover" :style="{ background: item.gradient }">
            <text>{{ item.coverText }}</text>
          </view>
          <view class="goods-info">
            <text class="title line-2">{{ item.title }}</text>
            <text class="sku">{{ item.skuName }}</text>
          </view>
          <view class="goods-side">
            <text>¥{{ money(item.price) }}</text>
            <text>x{{ item.quantity }}</text>
          </view>
        </view>

        <view class="order-total">
          <text>共 {{ order.items.length }} 件商品</text>
          <text>实付 ¥{{ money(order.totalAmount) }}</text>
        </view>

        <view class="actions">
          <view class="outline-btn" @click="goDetail(order)">订单详情</view>
          <view v-if="order.status === 'unpaid'" class="solid-btn" @click="handlePayOrder(order)">立即支付</view>
          <view v-else-if="order.status === 'shipped'" class="solid-btn" @click="handleFinishOrder(order)">确认收货</view>
          <view v-else class="solid-btn" @click="buyAgain(order)">再次购买</view>
        </view>
      </view>
    </view>

    <EmptyState
      v-else
      icon="📦"
      title="暂无相关订单"
      desc="下单后可在这里查看订单进度"
      button-text="去首页逛逛"
      @action="goHome"
    />
  </view>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import EmptyState from '@/components/EmptyState/EmptyState.vue'
import { finishOrder, getOrders, payOrder } from '@/api/order.js'
import { orderTabs, statusTextMap } from '@/common/constants.js'
import { money, requireLogin, setCheckoutItems } from '@/utils/storage.js'

const activeStatus = ref('all')
const orders = ref([])

const filteredOrders = computed(() => {
  if (activeStatus.value === 'all') {
    return orders.value
  }

  return orders.value.filter(item => item.status === activeStatus.value)
})

async function loadOrders() {
  if (!requireLogin()) {
    orders.value = []
    return
  }

  const res = await getOrders({
    status: activeStatus.value,
    page: 1,
    pageSize: 50
  })
  orders.value = res.list || []
}

function goDetail(order) {
  uni.navigateTo({
    url: `/pages/order/detail?id=${order.id}`
  })
}

async function handlePayOrder(order) {
  await payOrder(order.id)
  await loadOrders()

  uni.showToast({
    title: '支付成功',
    icon: 'success'
  })
}

async function handleFinishOrder(order) {
  await finishOrder(order.id)
  await loadOrders()

  uni.showToast({
    title: '已确认收货',
    icon: 'success'
  })
}

function buyAgain(order) {
  setCheckoutItems(order.items)
  uni.navigateTo({
    url: '/pages/order/confirm?from=buy'
  })
}

function goHome() {
  uni.switchTab({
    url: '/pages/home/index'
  })
}

onLoad(options => {
  activeStatus.value = options.status || 'all'
})

watch(activeStatus, () => {
  loadOrders()
})

onShow(loadOrders)
</script>

<style scoped lang="scss">
.order-list-page {
  padding-bottom: 36rpx;
}

.tabs {
  height: 92rpx;
  background: #ffffff;
  white-space: nowrap;
}

.tab {
  display: inline-flex;
  height: 92rpx;
  padding: 0 30rpx;
  align-items: center;
  justify-content: center;
  color: #5d6475;
  font-size: 28rpx;
  position: relative;
}

.tab.active {
  color: #ff4d3f;
  font-weight: 900;
}

.tab.active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 14rpx;
  width: 36rpx;
  height: 6rpx;
  margin-left: -18rpx;
  border-radius: 6rpx;
  background: #ff4d3f;
}

.order-list {
  padding: 24rpx;
}

.order-card {
  margin-bottom: 22rpx;
  padding: 26rpx;
}

.order-head {
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
}

.shop {
  color: #1f2430;
  font-size: 28rpx;
  font-weight: 900;
}

.status {
  color: #ff4d3f;
  font-size: 26rpx;
}

.goods-row {
  padding: 18rpx 0;
  display: flex;
  border-top: 1rpx solid #f0f2f7;
}

.cover {
  width: 128rpx;
  height: 128rpx;
  border-radius: 16rpx;
  padding: 14rpx;
  display: flex;
  align-items: flex-end;
  flex-shrink: 0;
}

.cover text {
  color: rgba(31, 36, 48, 0.72);
  font-size: 20rpx;
  font-weight: 700;
}

.goods-info {
  min-width: 0;
  flex: 1;
  margin-left: 18rpx;
}

.title {
  min-height: 62rpx;
  color: #1f2430;
  font-size: 26rpx;
  line-height: 32rpx;
  font-weight: 700;
}

.sku {
  display: inline-flex;
  margin-top: 8rpx;
  padding: 6rpx 12rpx;
  border-radius: 10rpx;
  background: #f4f6fa;
  color: #8a91a4;
  font-size: 22rpx;
}

.goods-side {
  margin-left: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: #5d6475;
  font-size: 24rpx;
}

.goods-side text:first-child {
  color: #1f2430;
  font-weight: 700;
}

.order-total {
  padding-top: 18rpx;
  border-top: 1rpx solid #f0f2f7;
  display: flex;
  justify-content: flex-end;
  color: #5d6475;
  font-size: 24rpx;
}

.order-total text:last-child {
  margin-left: 18rpx;
  color: #1f2430;
  font-weight: 900;
}

.actions {
  margin-top: 22rpx;
  display: flex;
  justify-content: flex-end;
}

.outline-btn,
.solid-btn {
  min-width: 148rpx;
  height: 62rpx;
  margin-left: 16rpx;
  padding: 0 22rpx;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}

.outline-btn {
  border: 1rpx solid #d8dde8;
  color: #5d6475;
}

.solid-btn {
  background: #fff2ef;
  color: #ff4d3f;
  font-weight: 800;
}
</style>
