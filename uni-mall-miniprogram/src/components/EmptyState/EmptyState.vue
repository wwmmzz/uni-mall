<template>
  <view class="empty">
    <view class="icon">{{ icon }}</view>
    <text class="title">{{ title }}</text>
    <text v-if="desc" class="desc">{{ desc }}</text>
    <view v-if="buttonText" class="button" @click="emit('action')">
      {{ buttonText }}
    </view>
  </view>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: '🛒'
  },
  title: {
    type: String,
    default: '暂无数据'
  },
  desc: {
    type: String,
    default: ''
  },
  buttonText: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['action'])
</script>

<style scoped lang="scss">
.empty {
  padding: 120rpx 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.icon {
  width: 148rpx;
  height: 148rpx;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 76rpx;
  box-shadow: 0 12rpx 36rpx rgba(31, 36, 48, 0.06);
}

.title {
  margin-top: 28rpx;
  color: #1f2430;
  font-size: 30rpx;
  font-weight: 700;
}

.desc {
  margin-top: 12rpx;
  color: #9aa1b2;
  font-size: 24rpx;
  line-height: 36rpx;
}

.button {
  margin-top: 36rpx;
  height: 72rpx;
  padding: 0 42rpx;
  border-radius: 36rpx;
  background: linear-gradient(135deg, #ff7a45 0%, #ff2d55 100%);
  color: #ffffff;
  font-size: 28rpx;
  line-height: 72rpx;
}
</style>
