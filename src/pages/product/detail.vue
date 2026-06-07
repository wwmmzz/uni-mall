<template>
  <view class="page detail-page safe-bottom">
    <view class="hero" :style="{ background: product.gradient }">
      <view class="hero-label">{{ product.coverText }}</view>
      <view class="hero-badge">{{ product.badge }}</view>
    </view>

    <view class="info-card card">
      <view class="price-row">
        <PriceText :value="product.price" size="large" />
        <text class="old-price">¥{{ money(product.oldPrice) }}</text>
        <text class="sales">已售 {{ product.sales }}</text>
      </view>

      <text class="title">{{ product.title }}</text>
      <text class="desc">{{ product.desc }}</text>

      <view class="tags">
        <text v-for="tag in product.tags" :key="tag" class="tag">{{ tag }}</text>
      </view>
    </view>

    <view class="card row-card" @click="goCoupon">
      <text class="row-label">优惠</text>
      <view class="row-main">
        <text class="coupon-chip">满99减20</text>
        <text class="coupon-chip">满299减50</text>
      </view>
      <text class="arrow">›</text>
    </view>

    <view class="card row-card">
      <text class="row-label">服务</text>
      <view class="row-main">
        <text>正品保障 · 极速发货 · 7天无理由</text>
      </view>
    </view>

    <view class="card sku-card">
      <view class="sku-title">选择规格</view>
      <view class="sku-list">
        <view
          v-for="sku in product.specs"
          :key="sku"
          class="sku-item"
          :class="{ active: selectedSku === sku }"
          @click="selectedSku = sku"
        >
          {{ sku }}
        </view>
      </view>

      <view class="quantity-row">
        <text>购买数量</text>
        <QuantityStepper v-model="quantity" :max="product.stock" />
      </view>
    </view>

    <view class="card comment-card">
      <view class="comment-title">
        <text>用户评价</text>
        <text class="comment-more">98% 好评 ›</text>
      </view>
      <view class="comment-user">
        <view class="comment-avatar">U</view>
        <view>
          <text class="comment-name">优选用户</text>
          <text class="comment-content">质量很不错，包装也完整，物流速度很快。</text>
        </view>
      </view>
    </view>

    <view class="card detail-card">
      <text class="detail-title">商品详情</text>
      <text class="detail-text">
        本页面为商城模板的商品详情页，包含商品头图、价格、标题、促销、服务、规格、数量、评价、收藏、加购和立即购买等常见功能。接入接口后可将商品信息、库存、SKU、评价等替换为后端数据。
      </text>
    </view>

    <view class="bottom-bar safe-bottom">
      <view class="tool" @click="goHome">
        <text>🏠</text>
        <text>首页</text>
      </view>
      <view class="tool" @click="goCart">
        <text>🛒</text>
        <text>购物车</text>
      </view>
      <view class="tool" @click="handleFavorite">
        <text>{{ favorite ? '⭐' : '☆' }}</text>
        <text>{{ favorite ? '已收藏' : '收藏' }}</text>
      </view>
      <view class="bar-actions">
        <view class="add-btn" @click="handleAddCart">加入购物车</view>
        <view class="buy-btn" @click="buyNow">立即购买</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import QuantityStepper from '@/components/QuantityStepper/QuantityStepper.vue'
import PriceText from '@/components/PriceText/PriceText.vue'
import { getProductById } from '@/common/mock.js'
import {
  addToCart,
  isFavorite,
  toggleFavorite,
  setCheckoutItems,
  money
} from '@/utils/storage.js'

const product = ref(getProductById('1001'))
const selectedSku = ref('')
const quantity = ref(1)
const favorite = ref(false)

function loadProduct(id) {
  product.value = getProductById(id)
  selectedSku.value = product.value.specs[0] || '默认规格'
  favorite.value = isFavorite(product.value.id)
}

function handleAddCart() {
  addToCart(product.value, { skuName: selectedSku.value }, quantity.value)

  uni.showToast({
    title: '已加入购物车',
    icon: 'success'
  })
}

function buyNow() {
  setCheckoutItems([
    {
      cartId: '',
      productId: product.value.id,
      title: product.value.title,
      price: product.value.price,
      oldPrice: product.value.oldPrice,
      cover: product.value.cover || '',
      coverText: product.value.coverText,
      gradient: product.value.gradient,
      skuName: selectedSku.value,
      quantity: quantity.value,
      checked: true
    }
  ])

  uni.navigateTo({
    url: '/pages/order/confirm?from=buy'
  })
}

function handleFavorite() {
  favorite.value = toggleFavorite(product.value)

  uni.showToast({
    title: favorite.value ? '已收藏' : '已取消收藏',
    icon: 'none'
  })
}

function goHome() {
  uni.switchTab({
    url: '/pages/home/index'
  })
}

function goCart() {
  uni.switchTab({
    url: '/pages/cart/cart'
  })
}

function goCoupon() {
  uni.navigateTo({
    url: '/pages/coupon/list?mode=select'
  })
}

onLoad(options => {
  loadProduct(options.id || '1001')
})

onShow(() => {
  favorite.value = isFavorite(product.value.id)
})
</script>

<style scoped lang="scss">
.detail-page {
  padding-bottom: 170rpx;
}

.hero {
  height: 560rpx;
  margin: 24rpx;
  border-radius: 36rpx;
  padding: 46rpx;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  overflow: hidden;
}

.hero-label {
  color: rgba(31, 36, 48, 0.72);
  font-size: 58rpx;
  font-weight: 900;
}

.hero-badge {
  padding: 10rpx 22rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.6);
  color: #ff4d3f;
  font-size: 24rpx;
  font-weight: 800;
}

.info-card,
.row-card,
.sku-card,
.comment-card,
.detail-card {
  margin: 0 24rpx 20rpx;
  padding: 26rpx;
}

.price-row {
  display: flex;
  align-items: baseline;
}

.old-price {
  margin-left: 16rpx;
  color: #b6bdca;
  font-size: 24rpx;
  text-decoration: line-through;
}

.sales {
  margin-left: auto;
  color: #8a91a4;
  font-size: 24rpx;
}

.title {
  display: block;
  margin-top: 18rpx;
  color: #1f2430;
  font-size: 36rpx;
  font-weight: 900;
  line-height: 48rpx;
}

.desc {
  display: block;
  margin-top: 12rpx;
  color: #7d8494;
  font-size: 26rpx;
  line-height: 40rpx;
}

.tags {
  margin-top: 18rpx;
  display: flex;
  flex-wrap: wrap;
}

.tag {
  margin-right: 12rpx;
  margin-bottom: 10rpx;
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
  background: #fff2ef;
  color: #ff4d3f;
  font-size: 22rpx;
}

.row-card {
  display: flex;
  align-items: center;
}

.row-label {
  width: 82rpx;
  color: #1f2430;
  font-size: 28rpx;
  font-weight: 800;
}

.row-main {
  flex: 1;
  min-width: 0;
  color: #5d6475;
  font-size: 26rpx;
  display: flex;
  flex-wrap: wrap;
}

.coupon-chip {
  margin-right: 10rpx;
  padding: 6rpx 12rpx;
  border-radius: 10rpx;
  background: #fff2ef;
  color: #ff4d3f;
  font-size: 22rpx;
}

.arrow {
  color: #c1c7d4;
  font-size: 36rpx;
}

.sku-title {
  color: #1f2430;
  font-size: 30rpx;
  font-weight: 900;
}

.sku-list {
  margin-top: 20rpx;
  display: flex;
  flex-wrap: wrap;
}

.sku-item {
  margin-right: 14rpx;
  margin-bottom: 14rpx;
  padding: 16rpx 24rpx;
  border-radius: 18rpx;
  background: #f4f6fa;
  color: #5d6475;
  font-size: 26rpx;
}

.sku-item.active {
  background: #fff2ef;
  color: #ff4d3f;
  font-weight: 800;
}

.quantity-row {
  margin-top: 18rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #1f2430;
  font-size: 28rpx;
  font-weight: 700;
}

.comment-title {
  display: flex;
  justify-content: space-between;
  color: #1f2430;
  font-size: 30rpx;
  font-weight: 900;
}

.comment-more {
  color: #8a91a4;
  font-size: 24rpx;
  font-weight: 400;
}

.comment-user {
  margin-top: 24rpx;
  display: flex;
}

.comment-avatar {
  width: 72rpx;
  height: 72rpx;
  margin-right: 18rpx;
  border-radius: 50%;
  background: #f0f3ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f8cff;
  font-weight: 900;
}

.comment-name {
  display: block;
  color: #1f2430;
  font-size: 26rpx;
  font-weight: 700;
}

.comment-content {
  display: block;
  margin-top: 8rpx;
  color: #7d8494;
  font-size: 24rpx;
  line-height: 36rpx;
}

.detail-title {
  display: block;
  color: #1f2430;
  font-size: 30rpx;
  font-weight: 900;
}

.detail-text {
  display: block;
  margin-top: 18rpx;
  color: #7d8494;
  font-size: 26rpx;
  line-height: 44rpx;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 120rpx;
  padding: 16rpx 20rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  box-shadow: 0 -8rpx 28rpx rgba(31, 36, 48, 0.08);
  z-index: 30;
}

.tool {
  width: 84rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #5d6475;
  font-size: 20rpx;
}

.tool text:first-child {
  margin-bottom: 6rpx;
  font-size: 34rpx;
}

.bar-actions {
  flex: 1;
  margin-left: 12rpx;
  height: 80rpx;
  border-radius: 44rpx;
  overflow: hidden;
  display: flex;
}

.add-btn,
.buy-btn {
  flex: 1;
  color: #ffffff;
  font-size: 26rpx;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn {
  background: linear-gradient(135deg, #ffb45c 0%, #ff7a45 100%);
}

.buy-btn {
  background: linear-gradient(135deg, #ff5a3c 0%, #ff2d55 100%);
}
</style>
