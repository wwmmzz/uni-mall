<template>
  <view class="page login-page">
    <view class="brand-card">
      <view class="logo">优</view>
      <text class="title">欢迎登录优选商城</text>
      <text class="sub-title">登录后可查看订单、收藏和优惠券</text>
    </view>

    <view class="form-card card">
      <view class="field">
        <text>手机号</text>
        <input v-model="form.phone" type="number" maxlength="11" placeholder="请输入手机号" />
      </view>
      <view class="field">
        <text>验证码</text>
        <input v-model="form.code" type="number" maxlength="6" placeholder="请输入验证码" />
        <view class="code-btn" @click="sendCode">获取验证码</view>
      </view>
      <view class="primary-btn login-btn" @click="login">立即登录</view>
      <text class="agreement">登录即代表你同意《用户协议》和《隐私政策》</text>
    </view>
  </view>
</template>

<script setup>
import { reactive } from 'vue'
import { setUser } from '@/utils/storage.js'

const form = reactive({
  phone: '13800138000',
  code: '123456'
})

function sendCode() {
  uni.showToast({
    title: '示例验证码：123456',
    icon: 'none'
  })
}

function login() {
  if (!/^1\d{10}$/.test(form.phone)) {
    uni.showToast({
      title: '请输入正确手机号',
      icon: 'none'
    })
    return
  }

  if (!form.code) {
    uni.showToast({
      title: '请输入验证码',
      icon: 'none'
    })
    return
  }

  setUser({
    id: `user_${Date.now()}`,
    nickname: '优选用户',
    phone: form.phone,
    avatar: ''
  })

  uni.showToast({
    title: '登录成功',
    icon: 'success'
  })

  setTimeout(() => {
    uni.navigateBack()
  }, 500)
}
</script>

<style scoped lang="scss">
.login-page {
  padding: 70rpx 40rpx;
  background: linear-gradient(180deg, #fff2ef 0%, #f6f7fb 48%, #f6f7fb 100%);
}

.brand-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
}

.logo {
  width: 132rpx;
  height: 132rpx;
  border-radius: 38rpx;
  background: linear-gradient(135deg, #ff7a45 0%, #ff2d55 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 70rpx;
  font-weight: 900;
  box-shadow: 0 16rpx 36rpx rgba(255, 77, 63, 0.24);
}

.title {
  margin-top: 30rpx;
  color: #1f2430;
  font-size: 40rpx;
  font-weight: 900;
}

.sub-title {
  margin-top: 14rpx;
  color: #8a91a4;
  font-size: 26rpx;
}

.form-card {
  padding: 12rpx 30rpx 36rpx;
}

.field {
  height: 108rpx;
  display: flex;
  align-items: center;
  border-bottom: 1rpx solid #f0f2f7;
}

.field text {
  width: 128rpx;
  color: #1f2430;
  font-size: 28rpx;
  font-weight: 700;
}

.field input {
  flex: 1;
  color: #1f2430;
  font-size: 28rpx;
}

.code-btn {
  height: 58rpx;
  padding: 0 18rpx;
  border-radius: 30rpx;
  background: #fff2ef;
  color: #ff4d3f;
  font-size: 24rpx;
  display: flex;
  align-items: center;
}

.login-btn {
  margin-top: 42rpx;
}

.agreement {
  display: block;
  margin-top: 24rpx;
  color: #a0a6b5;
  font-size: 22rpx;
  text-align: center;
}
</style>
