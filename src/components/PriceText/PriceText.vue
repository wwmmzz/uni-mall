<template>
  <view class="price-text" :class="size">
    <text class="currency">¥</text>
    <text class="integer">{{ parts[0] }}</text>
    <text class="decimal">.{{ parts[1] }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: [Number, String],
    default: 0
  },
  size: {
    type: String,
    default: 'normal'
  }
})

const parts = computed(() => Number(props.value || 0).toFixed(2).split('.'))
</script>

<style scoped lang="scss">
.price-text {
  display: flex;
  align-items: baseline;
  color: #ff4d3f;
  font-weight: 800;
}

.currency {
  font-size: 24rpx;
}

.integer {
  font-size: 42rpx;
}

.decimal {
  font-size: 24rpx;
}

.price-text.small .currency,
.price-text.small .decimal {
  font-size: 20rpx;
}

.price-text.small .integer {
  font-size: 30rpx;
}

.price-text.large .currency,
.price-text.large .decimal {
  font-size: 28rpx;
}

.price-text.large .integer {
  font-size: 56rpx;
}
</style>
