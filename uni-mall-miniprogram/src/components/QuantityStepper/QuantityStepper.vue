<template>
  <view class="stepper">
    <view class="step-btn" :class="{ disabled: innerValue <= min }" @click="minus">-</view>
    <input
      class="step-input"
      type="number"
      :value="innerValue"
      @input="handleInput"
      @blur="handleBlur"
    />
    <view class="step-btn" :class="{ disabled: innerValue >= max }" @click="plus">+</view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1
  },
  min: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: 999
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const innerValue = computed(() => {
  return Number(props.modelValue || props.min)
})

function update(value) {
  let next = Number(value || props.min)

  if (next < props.min) next = props.min
  if (next > props.max) next = props.max

  emit('update:modelValue', next)
  emit('change', next)
}

function minus() {
  if (innerValue.value <= props.min) return
  update(innerValue.value - 1)
}

function plus() {
  if (innerValue.value >= props.max) return
  update(innerValue.value + 1)
}

function handleInput(event) {
  update(event.detail.value)
}

function handleBlur(event) {
  update(event.detail.value)
}
</script>

<style scoped lang="scss">
.stepper {
  display: flex;
  align-items: center;
  overflow: hidden;
  border-radius: 28rpx;
  background: #f3f5f9;
}

.step-btn {
  width: 54rpx;
  height: 54rpx;
  color: #1f2430;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 700;
}

.step-btn.disabled {
  color: #c8ceda;
}

.step-input {
  width: 68rpx;
  height: 54rpx;
  text-align: center;
  color: #1f2430;
  font-size: 26rpx;
  font-weight: 600;
}
</style>
