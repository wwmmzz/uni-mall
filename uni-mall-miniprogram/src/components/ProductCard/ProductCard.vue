<template>
  <view class="product-card" @click="handleCardClick">
    <view class="cover" :style="{ background: item.gradient || defaultGradient }">
      <image
        v-if="item.cover"
        class="cover-image"
        :src="item.cover"
        mode="aspectFill"
      />
      <view v-else class="cover-placeholder">
        <text class="cover-title">{{ item.coverText || '优选好物' }}</text>
      </view>
      <text v-if="item.badge" class="badge">{{ item.badge }}</text>
    </view>

    <view class="body">
      <text class="title line-2">{{ item.title }}</text>

      <view class="tags" v-if="(item.tags || []).length">
        <text
          v-for="tag in (item.tags || []).slice(0, 2)"
          :key="tag"
          class="tag"
        >
          {{ tag }}
        </text>
      </view>

      <view class="bottom">
        <view class="price-box">
          <text class="currency">¥</text>
          <text class="price">{{ priceParts[0] }}</text>
          <text class="decimal">.{{ priceParts[1] }}</text>
        </view>
        <view v-if="showCart" class="cart-btn" @click.stop="handleAddCart">
          <text>+</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  showCart: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['card-click', 'add-cart'])

const defaultGradient = 'linear-gradient(135deg, #f0f3ff 0%, #e2e7ff 100%)'

const priceParts = computed(() => {
  return Number(props.item.price || 0).toFixed(2).split('.')
})

function handleCardClick() {
  emit('card-click', props.item)
}

function handleAddCart() {
  emit('add-cart', props.item)
}
</script>

<style scoped lang="scss">
.product-card {
  overflow: hidden;
  background: #ffffff;
  border-radius: 24rpx;
  box-shadow: 0 10rpx 30rpx rgba(31, 36, 48, 0.05);
}

.cover {
  position: relative;
  width: 100%;
  height: 260rpx;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  padding: 28rpx;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
}

.cover-title {
  color: rgba(31, 36, 48, 0.72);
  font-size: 30rpx;
  font-weight: 700;
}

.badge {
  position: absolute;
  top: 18rpx;
  left: 18rpx;
  height: 38rpx;
  padding: 0 14rpx;
  border-radius: 20rpx;
  background: rgba(255, 77, 63, 0.92);
  color: #ffffff;
  font-size: 22rpx;
  line-height: 38rpx;
}

.body {
  padding: 18rpx;
}

.title {
  min-height: 72rpx;
  color: #1f2430;
  font-size: 28rpx;
  line-height: 36rpx;
  font-weight: 600;
}

.tags {
  height: 36rpx;
  margin-top: 12rpx;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.tag {
  margin-right: 8rpx;
  padding: 0 10rpx;
  height: 32rpx;
  border-radius: 8rpx;
  background: #fff2ef;
  color: #ff4d3f;
  font-size: 20rpx;
  line-height: 32rpx;
}

.bottom {
  margin-top: 16rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price-box {
  display: flex;
  align-items: baseline;
  color: #ff4d3f;
}

.currency {
  font-size: 22rpx;
  font-weight: 700;
}

.price {
  font-size: 36rpx;
  font-weight: 800;
}

.decimal {
  font-size: 22rpx;
  font-weight: 700;
}

.cart-btn {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff7a45 0%, #ff2d55 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34rpx;
  font-weight: 700;
  box-shadow: 0 8rpx 18rpx rgba(255, 77, 63, 0.24);
}
</style>
