<template>
  <view class="page order-detail-page safe-bottom">
    <view v-if="order" class="content">
      <view class="status-card">
        <text class="status-title">{{ statusTextMap[order.status] || order.statusText }}</text>
        <text class="status-desc">感谢你的支持，优选商城将尽快处理订单。</text>
      </view>

      <view class="card address-card">
        <text class="section-title">收货信息</text>
        <text class="receiver">{{ order.address.name }} {{ order.address.phone }}</text>
        <text class="address">
          {{ order.address.province }}{{ order.address.city }}{{ order.address.district }}{{ order.address.detail }}
        </text>
      </view>

      <view class="card goods-card">
        <text class="section-title">商品信息</text>
        <view v-for="item in order.items" :key="item.productId + item.skuName" class="goods-row">
          <view class="cover" :style="{ background: item.gradient }">
            <text>{{ item.coverText }}</text>
          </view>
          <view class="goods-info">
            <text class="title line-2">{{ item.title }}</text>
            <text class="sku">{{ item.skuName }}</text>
            <view class="price-row">
              <text>¥{{ money(item.price) }}</text>
              <text>x{{ item.quantity }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="card fee-card">
        <view class="fee-row">
          <text>商品金额</text>
          <text>¥{{ money(order.goodsAmount) }}</text>
        </view>
        <view class="fee-row">
          <text>运费</text>
          <text>{{ getFreightText(order.freight) }}</text>
        </view>
        <view class="fee-row">
          <text>优惠</text>
          <text>-¥{{ money(order.discount) }}</text>
        </view>
        <view class="fee-row total">
          <text>实付款</text>
          <text>¥{{ money(order.totalAmount) }}</text>
        </view>
      </view>

      <view class="card info-card">
        <view class="info-row">
          <text>订单编号</text>
          <text>{{ order.id }}</text>
        </view>
        <view class="info-row">
          <text>下单时间</text>
          <text>{{ order.createdAt }}</text>
        </view>
        <view class="info-row">
          <text>支付方式</text>
          <text>{{ order.payType }}</text>
        </view>
        <view v-if="order.remark" class="info-row">
          <text>买家留言</text>
          <text>{{ order.remark }}</text>
        </view>
      </view>

      <view class="bottom-actions safe-bottom">
        <view class="outline-btn" @click="copyOrderNo">复制单号</view>
        <view class="solid-btn" @click="buyAgain">再次购买</view>
      </view>
    </view>

    <EmptyState
      v-else
      icon="📦"
      title="订单不存在"
      desc="可能订单已删除或缓存被清空"
      button-text="返回订单列表"
      @action="goOrderList"
    />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import EmptyState from '@/components/EmptyState/EmptyState.vue'
import { statusTextMap } from '@/common/mock.js'
import { getOrderById, setCheckoutItems, money } from '@/utils/storage.js'

const order = ref(null)

function getFreightText(value) {
  return Number(value || 0) === 0 ? '包邮' : `¥${money(value)}`
}

function copyOrderNo() {
  uni.setClipboardData({
    data: order.value.id
  })
}

function buyAgain() {
  setCheckoutItems(order.value.items)
  uni.navigateTo({
    url: '/pages/order/confirm?from=buy'
  })
}

function goOrderList() {
  uni.redirectTo({
    url: '/pages/order/list'
  })
}

onLoad(options => {
  order.value = getOrderById(options.id)
})
</script>

<style scoped lang="scss">
.order-detail-page {
  padding-bottom: 160rpx;
}

.content {
  padding: 24rpx;
}

.status-card {
  margin-bottom: 20rpx;
  padding: 40rpx 30rpx;
  border-radius: 28rpx;
  background: linear-gradient(135deg, #ff7a45 0%, #ff2d55 100%);
  color: #ffffff;
}

.status-title {
  display: block;
  font-size: 40rpx;
  font-weight: 900;
}

.status-desc {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  opacity: 0.88;
}

.address-card,
.goods-card,
.fee-card,
.info-card {
  margin-bottom: 20rpx;
  padding: 26rpx;
}

.section-title {
  display: block;
  margin-bottom: 18rpx;
  color: #1f2430;
  font-size: 30rpx;
  font-weight: 900;
}

.receiver {
  display: block;
  color: #1f2430;
  font-size: 28rpx;
  font-weight: 800;
}

.address {
  display: block;
  margin-top: 10rpx;
  color: #7d8494;
  font-size: 24rpx;
  line-height: 38rpx;
}

.goods-row {
  padding: 18rpx 0;
  display: flex;
  border-top: 1rpx solid #f0f2f7;
}

.goods-row:first-of-type {
  border-top: 0;
}

.cover {
  width: 140rpx;
  height: 140rpx;
  padding: 16rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: flex-end;
  flex-shrink: 0;
}

.cover text {
  color: rgba(31, 36, 48, 0.72);
  font-size: 22rpx;
  font-weight: 700;
}

.goods-info {
  flex: 1;
  min-width: 0;
  margin-left: 20rpx;
}

.title {
  color: #1f2430;
  font-size: 28rpx;
  line-height: 36rpx;
  font-weight: 700;
}

.sku {
  display: inline-flex;
  margin-top: 10rpx;
  padding: 6rpx 12rpx;
  border-radius: 10rpx;
  background: #f4f6fa;
  color: #8a91a4;
  font-size: 22rpx;
}

.price-row {
  margin-top: 14rpx;
  display: flex;
  justify-content: space-between;
  color: #5d6475;
  font-size: 24rpx;
}

.price-row text:first-child {
  color: #ff4d3f;
  font-size: 30rpx;
  font-weight: 900;
}

.fee-row,
.info-row {
  min-height: 70rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #5d6475;
  font-size: 26rpx;
  border-bottom: 1rpx solid #f0f2f7;
}

.fee-row:last-child,
.info-row:last-child {
  border-bottom: 0;
}

.fee-row text:last-child,
.info-row text:last-child {
  max-width: 430rpx;
  text-align: right;
  color: #1f2430;
}

.fee-row.total text:last-child {
  color: #ff4d3f;
  font-size: 34rpx;
  font-weight: 900;
}

.bottom-actions {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 118rpx;
  padding: 18rpx 24rpx;
  background: #ffffff;
  display: flex;
  justify-content: flex-end;
  box-shadow: 0 -8rpx 28rpx rgba(31, 36, 48, 0.08);
}

.outline-btn,
.solid-btn {
  min-width: 170rpx;
  height: 78rpx;
  margin-left: 18rpx;
  padding: 0 26rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

.outline-btn {
  border: 1rpx solid #d8dde8;
  color: #5d6475;
}

.solid-btn {
  background: linear-gradient(135deg, #ff7a45 0%, #ff2d55 100%);
  color: #ffffff;
  font-weight: 900;
}
</style>
