<template>
  <view class="page confirm-page safe-bottom">
    <view class="address-card card" @click="chooseAddress">
      <view v-if="address" class="address-content">
        <view class="address-icon">📍</view>
        <view class="address-main">
          <view class="receiver">
            <text>{{ address.name }}</text>
            <text>{{ address.phone }}</text>
          </view>
          <text class="address-text">
            {{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}
          </text>
        </view>
        <text class="arrow">›</text>
      </view>

      <view v-else class="address-empty">
        <text>请选择收货地址</text>
        <text class="arrow">›</text>
      </view>
    </view>

    <view class="card goods-card">
      <view class="shop-row">
        <text class="shop-name">优选商城自营</text>
        <text class="shop-tip">正品保障</text>
      </view>

      <view v-for="item in items" :key="item.productId + item.skuName" class="goods-item">
        <view class="cover" :style="{ background: item.gradient }">
          <text>{{ item.coverText }}</text>
        </view>
        <view class="goods-info">
          <text class="goods-title line-2">{{ item.title }}</text>
          <text class="sku">{{ item.skuName }}</text>
          <view class="goods-bottom">
            <text class="price">¥{{ money(item.price) }}</text>
            <text class="quantity">x{{ item.quantity }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="card fee-card">
      <view class="fee-row">
        <text>商品金额</text>
        <text>¥{{ money(goodsAmount) }}</text>
      </view>
      <view class="fee-row">
        <text>运费</text>
        <text>{{ freightText }}</text>
      </view>
      <view class="fee-row" @click="chooseCoupon">
        <text>优惠券</text>
        <view class="coupon-value">
          <text v-if="selectedCoupon && discount > 0">-¥{{ money(discount) }}</text>
          <text v-else>选择优惠券</text>
          <text class="arrow">›</text>
        </view>
      </view>
      <view class="fee-row">
        <text>买家留言</text>
        <input v-model="remark" class="remark" placeholder="选填，建议先和商家协商" />
      </view>
    </view>

    <view class="card pay-card">
      <text class="pay-title">支付方式</text>
      <view class="pay-method active">
        <text>💬 微信支付</text>
        <text class="check">✓</text>
      </view>
    </view>

    <view class="bottom-bar safe-bottom">
      <view class="total">
        <text class="label">应付：</text>
        <text class="amount">¥{{ money(totalAmount) }}</text>
      </view>
      <view class="submit-btn" @click="submitOrder">提交订单</view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getAddressList } from '@/api/address.js'
import { createOrder } from '@/api/order.js'
import {
  clearCheckoutItems,
  getCheckoutItems,
  getCheckoutAddress,
  getSelectedCoupon,
  setSelectedCoupon,
  setCheckoutAddress,
  requireLogin,
  money
} from '@/utils/storage.js'

const items = ref([])
const address = ref(null)
const selectedCoupon = ref(null)
const remark = ref('')
const source = ref('buy')

const goodsAmount = computed(() => {
  return items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const freight = computed(() => {
  return goodsAmount.value >= 99 ? 0 : 8
})

const freightText = computed(() => {
  return freight.value === 0 ? '包邮' : `¥${money(freight.value)}`
})

const discount = computed(() => {
  if (!selectedCoupon.value) return 0
  return goodsAmount.value >= selectedCoupon.value.threshold ? selectedCoupon.value.amount : 0
})

const totalAmount = computed(() => {
  const total = goodsAmount.value + freight.value - discount.value
  return total > 0 ? total : 0
})

async function loadAddressAndCoupon() {
  if (!requireLogin()) {
    return
  }

  const selectedAddress = getCheckoutAddress()
  const list = await getAddressList()
  address.value = selectedAddress || list.find(item => item.isDefault) || list[0] || null
  selectedCoupon.value = getSelectedCoupon()
}

function chooseAddress() {
  uni.navigateTo({
    url: '/pages/address/list?mode=select'
  })
}

function chooseCoupon() {
  uni.navigateTo({
    url: '/pages/coupon/list?mode=select'
  })
}

async function submitOrder() {
  if (!items.value.length) {
    uni.showToast({
      title: '暂无可结算商品',
      icon: 'none'
    })
    return
  }

  if (!address.value) {
    uni.showToast({
      title: '请选择收货地址',
      icon: 'none'
    })
    return
  }

  const payload = {
    addressId: address.value.id,
    couponId: selectedCoupon.value?.id,
    remark: remark.value,
    payNow: true
  }

  if (source.value === 'cart') {
    payload.cartItemIds = items.value.map(item => item.cartId || item.id).filter(Boolean)
  } else {
    payload.items = items.value.map(item => ({
      productId: item.productId,
      skuName: item.skuName,
      quantity: item.quantity
    }))
  }

  const order = await createOrder(payload)

  setSelectedCoupon(null)
  setCheckoutAddress(null)
  clearCheckoutItems()

  uni.redirectTo({
    url: `/pages/payment/result?status=success&orderId=${order.orderNo}`
  })
}

onLoad(options => {
  source.value = options.from || 'buy'
  items.value = getCheckoutItems()
})

onShow(loadAddressAndCoupon)
</script>

<style scoped lang="scss">
.confirm-page {
  padding: 24rpx 24rpx 180rpx;
}

.address-card {
  margin-bottom: 20rpx;
  padding: 28rpx;
}

.address-content {
  display: flex;
  align-items: center;
}

.address-icon {
  width: 70rpx;
  height: 70rpx;
  margin-right: 18rpx;
  border-radius: 50%;
  background: #fff2ef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34rpx;
}

.address-main {
  flex: 1;
  min-width: 0;
}

.receiver {
  color: #1f2430;
  font-size: 30rpx;
  font-weight: 900;
}

.receiver text:last-child {
  margin-left: 18rpx;
  font-size: 26rpx;
  font-weight: 600;
}

.address-text {
  display: block;
  margin-top: 10rpx;
  color: #7d8494;
  font-size: 24rpx;
  line-height: 36rpx;
}

.address-empty {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #1f2430;
  font-size: 28rpx;
  font-weight: 700;
}

.arrow {
  color: #c1c7d4;
  font-size: 36rpx;
}

.goods-card,
.fee-card,
.pay-card {
  margin-bottom: 20rpx;
  padding: 26rpx;
}

.shop-row {
  margin-bottom: 22rpx;
  display: flex;
  justify-content: space-between;
}

.shop-name {
  color: #1f2430;
  font-size: 28rpx;
  font-weight: 900;
}

.shop-tip {
  color: #ff4d3f;
  font-size: 24rpx;
}

.goods-item {
  padding: 22rpx 0;
  display: flex;
  border-top: 1rpx solid #f0f2f7;
}

.cover {
  width: 150rpx;
  height: 150rpx;
  border-radius: 18rpx;
  padding: 16rpx;
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
  min-width: 0;
  flex: 1;
  margin-left: 20rpx;
}

.goods-title {
  min-height: 68rpx;
  color: #1f2430;
  font-size: 28rpx;
  line-height: 34rpx;
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

.goods-bottom {
  margin-top: 12rpx;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.price {
  color: #ff4d3f;
  font-size: 30rpx;
  font-weight: 900;
}

.quantity {
  color: #8a91a4;
  font-size: 24rpx;
}

.fee-row {
  min-height: 76rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #1f2430;
  font-size: 28rpx;
  border-bottom: 1rpx solid #f0f2f7;
}

.fee-row:last-child {
  border-bottom: 0;
}

.coupon-value {
  color: #ff4d3f;
  display: flex;
  align-items: center;
}

.remark {
  flex: 1;
  margin-left: 24rpx;
  text-align: right;
  color: #1f2430;
  font-size: 26rpx;
}

.pay-title {
  display: block;
  margin-bottom: 20rpx;
  color: #1f2430;
  font-size: 30rpx;
  font-weight: 900;
}

.pay-method {
  height: 76rpx;
  padding: 0 20rpx;
  border-radius: 18rpx;
  background: #f7f8fb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #1f2430;
  font-size: 28rpx;
}

.pay-method.active {
  background: #fff2ef;
}

.check {
  color: #ff4d3f;
  font-weight: 900;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 120rpx;
  padding: 18rpx 24rpx;
  background: #ffffff;
  box-shadow: 0 -8rpx 28rpx rgba(31, 36, 48, 0.08);
  display: flex;
  align-items: center;
  z-index: 30;
}

.total {
  flex: 1;
  display: flex;
  align-items: baseline;
}

.label {
  color: #5d6475;
  font-size: 24rpx;
}

.amount {
  color: #ff4d3f;
  font-size: 40rpx;
  font-weight: 900;
}

.submit-btn {
  width: 220rpx;
  height: 84rpx;
  border-radius: 42rpx;
  background: linear-gradient(135deg, #ff7a45 0%, #ff2d55 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 900;
}
</style>
