<template>
  <view class="page cart-page">
    <view v-if="cartList.length" class="cart-content">
      <view class="tip-card">
        <text>满 99 元包邮，已选 {{ selectedCount }} 件商品</text>
      </view>

      <view class="cart-list">
        <view v-for="(item, index) in cartList" :key="item.cartId" class="cart-item card">
          <view
            class="select-dot"
            :class="{ active: item.checked }"
            @click="toggleItem(index)"
          >
            <text v-if="item.checked">✓</text>
          </view>

          <view class="cover" :style="{ background: item.gradient }" @click="goDetail(item)">
            <text>{{ item.coverText }}</text>
          </view>

          <view class="info">
            <view class="title-row">
              <text class="title line-2" @click="goDetail(item)">{{ item.title }}</text>
              <text class="delete" @click="removeItem(index)">删除</text>
            </view>
            <text class="sku">{{ item.skuName }}</text>
            <view class="bottom-row">
              <text class="price">¥{{ money(item.price) }}</text>
              <QuantityStepper
                :model-value="item.quantity"
                :min="1"
                :max="99"
                @change="value => updateQuantity(index, value)"
              />
            </view>
          </view>
        </view>
      </view>

      <view class="settlement safe-bottom">
        <view class="select-all" @click="toggleAll">
          <view class="select-dot small" :class="{ active: isAllSelected }">
            <text v-if="isAllSelected">✓</text>
          </view>
          <text>全选</text>
        </view>

        <view class="total-box">
          <text class="label">合计：</text>
          <text class="total">¥{{ money(totalAmount) }}</text>
        </view>

        <view class="settle-btn" :class="{ disabled: !selectedCount }" @click="checkout">
          结算({{ selectedCount }})
        </view>
      </view>
    </view>

    <EmptyState
      v-else
      icon="🛒"
      title="购物车还是空的"
      desc="去首页挑选几件心仪好物吧"
      button-text="去逛逛"
      @action="goHome"
    />
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import EmptyState from '@/components/EmptyState/EmptyState.vue'
import QuantityStepper from '@/components/QuantityStepper/QuantityStepper.vue'
import { checkAllCart, getCart, removeCartItem, updateCartItem } from '@/api/cart.js'
import { money, requireLogin, setCheckoutItems } from '@/utils/storage.js'

const cartList = ref([])

const selectedItems = computed(() => cartList.value.filter(item => item.checked))
const selectedCount = computed(() => selectedItems.value.reduce((sum, item) => sum + item.quantity, 0))
const totalAmount = computed(() => selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0))
const isAllSelected = computed(() => cartList.value.length > 0 && cartList.value.every(item => item.checked))

function applyCartResult(result) {
  cartList.value = result.list || []
}

async function loadCart() {
  if (!requireLogin()) {
    cartList.value = []
    return
  }

  const res = await getCart()
  applyCartResult(res)
}

async function toggleItem(index) {
  const item = cartList.value[index]
  const res = await updateCartItem(item.id, {
    checked: !item.checked
  })
  applyCartResult(res)
}

async function toggleAll() {
  const res = await checkAllCart({
    checked: !isAllSelected.value
  })
  applyCartResult(res)
}

async function updateQuantity(index, value) {
  const item = cartList.value[index]
  const res = await updateCartItem(item.id, {
    quantity: value
  })
  applyCartResult(res)
}

function removeItem(index) {
  uni.showModal({
    title: '提示',
    content: '确定删除该商品吗？',
    confirmColor: '#ff4d3f',
    success: result => {
      if (result.confirm) {
        removeCartItem(cartList.value[index].id).then(res => {
          applyCartResult(res)
        })
      }
    }
  })
}

function checkout() {
  if (!selectedItems.value.length) {
    uni.showToast({
      title: '请先选择商品',
      icon: 'none'
    })
    return
  }

  setCheckoutItems(selectedItems.value)
  uni.navigateTo({
    url: '/pages/order/confirm?from=cart'
  })
}

function goHome() {
  uni.switchTab({
    url: '/pages/home/index'
  })
}

function goDetail(item) {
  uni.navigateTo({
    url: `/pages/product/detail?id=${item.productId}`
  })
}

onShow(loadCart)
</script>

<style scoped lang="scss">
.cart-page {
  padding-bottom: 180rpx;
}

.cart-content {
  padding: 20rpx 24rpx 0;
}

.tip-card {
  height: 64rpx;
  margin-bottom: 20rpx;
  padding: 0 22rpx;
  border-radius: 18rpx;
  background: #fff4f2;
  color: #ff4d3f;
  display: flex;
  align-items: center;
  font-size: 24rpx;
}

.cart-item {
  margin-bottom: 20rpx;
  padding: 22rpx;
  display: flex;
  align-items: center;
}

.select-dot {
  width: 42rpx;
  height: 42rpx;
  margin-right: 18rpx;
  border: 2rpx solid #d8dde8;
  border-radius: 50%;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  flex-shrink: 0;
}

.select-dot.active {
  border-color: #ff4d3f;
  background: #ff4d3f;
}

.select-dot.small {
  width: 36rpx;
  height: 36rpx;
  margin-right: 10rpx;
  font-size: 22rpx;
}

.cover {
  width: 164rpx;
  height: 164rpx;
  border-radius: 20rpx;
  padding: 18rpx;
  display: flex;
  align-items: flex-end;
  flex-shrink: 0;
}

.cover text {
  color: rgba(31, 36, 48, 0.72);
  font-size: 24rpx;
  font-weight: 700;
}

.info {
  min-width: 0;
  flex: 1;
  margin-left: 20rpx;
}

.title-row {
  display: flex;
  align-items: flex-start;
}

.title {
  flex: 1;
  min-height: 72rpx;
  color: #1f2430;
  font-size: 28rpx;
  line-height: 36rpx;
  font-weight: 700;
}

.delete {
  margin-left: 16rpx;
  color: #a0a6b5;
  font-size: 24rpx;
}

.sku {
  display: inline-flex;
  margin-top: 12rpx;
  padding: 6rpx 12rpx;
  border-radius: 10rpx;
  background: #f4f6fa;
  color: #8a91a4;
  font-size: 22rpx;
}

.bottom-row {
  margin-top: 16rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price {
  color: #ff4d3f;
  font-size: 32rpx;
  font-weight: 800;
}

.settlement {
  position: fixed;
  left: 0;
  right: 0;
  bottom: var(--window-bottom);
  min-height: 116rpx;
  padding: 18rpx 24rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  box-shadow: 0 -8rpx 28rpx rgba(31, 36, 48, 0.08);
  z-index: 20;
}

.select-all {
  display: flex;
  align-items: center;
  color: #5d6475;
  font-size: 26rpx;
}

.total-box {
  margin-left: auto;
  margin-right: 20rpx;
  display: flex;
  align-items: baseline;
}

.label {
  color: #5d6475;
  font-size: 24rpx;
}

.total {
  color: #ff4d3f;
  font-size: 34rpx;
  font-weight: 900;
}

.settle-btn {
  width: 188rpx;
  height: 78rpx;
  border-radius: 40rpx;
  background: linear-gradient(135deg, #ff7a45 0%, #ff2d55 100%);
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settle-btn.disabled {
  opacity: 0.45;
}
</style>
