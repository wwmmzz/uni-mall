<template>
  <view class="section-title">
    <view>
      <text class="title">{{ title }}</text>
      <text v-if="subTitle" class="sub-title">{{ subTitle }}</text>
    </view>
    <view v-if="moreText" class="more" @click="emit('more')">
      <text>{{ moreText }}</text>
      <text class="arrow">›</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  subTitle: {
    type: String,
    default: ''
  },
  moreText: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['more'])
</script>

<style scoped lang="scss">
.section-title {
  padding: 30rpx 24rpx 18rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  color: #1f2430;
  font-size: 34rpx;
  font-weight: 800;
}

.sub-title {
  margin-left: 12rpx;
  color: #9aa1b2;
  font-size: 24rpx;
}

.more {
  display: flex;
  align-items: center;
  color: #8a91a4;
  font-size: 24rpx;
}

.arrow {
  margin-left: 4rpx;
  font-size: 30rpx;
}
</style>
