<template>
  <view class="page user-page safe-bottom">
    <view class="user-card">
      <view class="avatar">
        <text>{{ user ? user.nickname.slice(0, 1) : '未' }}</text>
      </view>

      <view class="user-info" v-if="user">
        <text class="name">{{ user.nickname }}</text>
        <text class="member">优选会员 · {{ user.phone }}</text>
      </view>

      <view class="user-info" v-else @click="goLogin">
        <text class="name">登录 / 注册</text>
        <text class="member">登录后查看订单、优惠券和收藏</text>
      </view>

      <view class="login-btn" v-if="!user" @click="goLogin">去登录</view>
    </view>

    <view class="asset-card card">
      <view class="asset-item" @click="goCoupon">
        <text class="asset-value">3</text>
        <text class="asset-label">优惠券</text>
      </view>
      <view class="asset-item" @click="goFavorite">
        <text class="asset-value">{{ favoriteCount }}</text>
        <text class="asset-label">收藏</text>
      </view>
      <view class="asset-item">
        <text class="asset-value">1280</text>
        <text class="asset-label">积分</text>
      </view>
      <view class="asset-item">
        <text class="asset-value">0.00</text>
        <text class="asset-label">余额</text>
      </view>
    </view>

    <view class="order-card card">
      <view class="card-title-row" @click="goOrders('all')">
        <text class="card-title">我的订单</text>
        <text class="card-more">全部订单 ›</text>
      </view>

      <view class="order-actions">
        <view
          v-for="item in orderActions"
          :key="item.status"
          class="order-action"
          @click="goOrders(item.status)"
        >
          <text class="order-icon">{{ item.icon }}</text>
          <text>{{ item.name }}</text>
        </view>
      </view>
    </view>

    <view class="menu-card card">
      <view class="menu-item" @click="goAddress">
        <text class="menu-icon">📍</text>
        <text class="menu-name">收货地址</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goFavorite">
        <text class="menu-icon">⭐</text>
        <text class="menu-name">我的收藏</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goCoupon">
        <text class="menu-icon">🎟️</text>
        <text class="menu-name">优惠券中心</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="showService">
        <text class="menu-icon">🎧</text>
        <text class="menu-name">联系客服</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="showAbout">
        <text class="menu-icon">ℹ️</text>
        <text class="menu-name">关于商城</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <view v-if="user" class="logout" @click="logout">退出登录</view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getUser, setUser, getFavorites } from '@/utils/storage.js'

const user = ref(null)
const favoriteCount = ref(0)

const orderActions = [
  { status: 'unpaid', name: '待付款', icon: '💳' },
  { status: 'paid', name: '待发货', icon: '📦' },
  { status: 'shipped', name: '待收货', icon: '🚚' },
  { status: 'finished', name: '已完成', icon: '✅' }
]

function loadUser() {
  user.value = getUser()
  favoriteCount.value = getFavorites().length
}

function goLogin() {
  uni.navigateTo({
    url: '/pages/login/login'
  })
}

function goOrders(status) {
  uni.navigateTo({
    url: `/pages/order/list?status=${status}`
  })
}

function goAddress() {
  uni.navigateTo({
    url: '/pages/address/list'
  })
}

function goFavorite() {
  uni.navigateTo({
    url: '/pages/favorite/list'
  })
}

function goCoupon() {
  uni.navigateTo({
    url: '/pages/coupon/list'
  })
}

function showService() {
  uni.showModal({
    title: '联系客服',
    content: '示例项目暂未接入在线客服，可替换为企业微信客服或小程序客服。',
    showCancel: false
  })
}

function showAbout() {
  uni.showModal({
    title: '关于商城',
    content: '这是一套 uni-app Vue3 小程序商城页面模板，可接入真实接口后上线使用。',
    showCancel: false
  })
}

function logout() {
  uni.showModal({
    title: '提示',
    content: '确定退出登录吗？',
    confirmColor: '#ff4d3f',
    success: result => {
      if (result.confirm) {
        setUser(null)
        loadUser()
      }
    }
  })
}

onShow(loadUser)
</script>

<style scoped lang="scss">
.user-page {
  padding: 24rpx;
}

.user-card {
  min-height: 220rpx;
  padding: 36rpx 30rpx;
  border-radius: 32rpx;
  background: linear-gradient(135deg, #ff7a45 0%, #ff2d55 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  box-shadow: 0 16rpx 40rpx rgba(255, 77, 63, 0.22);
}

.avatar {
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.24);
  border: 4rpx solid rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 46rpx;
  font-weight: 900;
}

.user-info {
  flex: 1;
  min-width: 0;
  margin-left: 24rpx;
}

.name {
  display: block;
  font-size: 36rpx;
  font-weight: 900;
}

.member {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  opacity: 0.88;
}

.login-btn {
  width: 130rpx;
  height: 58rpx;
  border-radius: 30rpx;
  background: rgba(255, 255, 255, 0.24);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}

.asset-card {
  margin-top: -28rpx;
  padding: 28rpx 0 22rpx;
  display: flex;
}

.asset-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.asset-value {
  color: #1f2430;
  font-size: 34rpx;
  font-weight: 900;
}

.asset-label {
  margin-top: 8rpx;
  color: #8a91a4;
  font-size: 24rpx;
}

.order-card,
.menu-card {
  margin-top: 24rpx;
}

.card-title-row {
  padding: 28rpx 26rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  color: #1f2430;
  font-size: 30rpx;
  font-weight: 900;
}

.card-more {
  color: #9aa1b2;
  font-size: 24rpx;
}

.order-actions {
  padding: 4rpx 0 28rpx;
  display: flex;
}

.order-action {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #5d6475;
  font-size: 24rpx;
}

.order-icon {
  margin-bottom: 12rpx;
  font-size: 44rpx;
}

.menu-card {
  overflow: hidden;
}

.menu-item {
  min-height: 96rpx;
  padding: 0 26rpx;
  display: flex;
  align-items: center;
  border-bottom: 1rpx solid #f0f2f7;
}

.menu-item:last-child {
  border-bottom: 0;
}

.menu-icon {
  width: 52rpx;
  font-size: 34rpx;
}

.menu-name {
  flex: 1;
  color: #1f2430;
  font-size: 28rpx;
}

.menu-arrow {
  color: #c1c7d4;
  font-size: 36rpx;
}

.logout {
  height: 88rpx;
  margin-top: 34rpx;
  border-radius: 44rpx;
  background: #ffffff;
  color: #ff4d3f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 700;
}
</style>
