<template>
  <view class="page address-list-page safe-bottom">
    <view v-if="addressList.length" class="list">
      <view v-for="item in addressList" :key="item.id" class="address-card card">
        <view class="main" @click="choose(item)">
          <view class="receiver">
            <text>{{ item.name }}</text>
            <text>{{ item.phone }}</text>
            <text v-if="item.isDefault" class="default-tag">默认</text>
          </view>
          <text class="address">
            {{ item.province }}{{ item.city }}{{ item.district }}{{ item.detail }}
          </text>
        </view>

        <view class="actions">
          <view class="action" @click="makeDefault(item)">
            <text>{{ item.isDefault ? '默认地址' : '设为默认' }}</text>
          </view>
          <view class="action" @click="edit(item)">编辑</view>
          <view class="action danger" @click="remove(item)">删除</view>
        </view>
      </view>
    </view>

    <EmptyState
      v-else
      icon="📍"
      title="暂无收货地址"
      desc="添加地址后结算会更方便"
    />

    <view class="bottom safe-bottom">
      <view class="primary-btn" @click="addAddress">新增收货地址</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import EmptyState from '@/components/EmptyState/EmptyState.vue'
import { deleteAddress, getAddressList, setDefaultAddress } from '@/api/address.js'
import { requireLogin, setCheckoutAddress } from '@/utils/storage.js'

const addressList = ref([])
const mode = ref('normal')

async function loadAddress() {
  if (!requireLogin()) {
    addressList.value = []
    return
  }

  addressList.value = await getAddressList()
}

function choose(item) {
  if (mode.value === 'select') {
    setCheckoutAddress(item)

    uni.navigateBack()
  }
}

function addAddress() {
  uni.navigateTo({
    url: '/pages/address/edit'
  })
}

function edit(item) {
  uni.navigateTo({
    url: `/pages/address/edit?data=${encodeURIComponent(JSON.stringify(item))}`
  })
}

async function makeDefault(item) {
  await setDefaultAddress(item.id)
  loadAddress()
}

function remove(item) {
  uni.showModal({
    title: '提示',
    content: '确定删除该地址吗？',
    confirmColor: '#ff4d3f',
    success: result => {
      if (result.confirm) {
        deleteAddress(item.id).then(() => {
          loadAddress()
        })
      }
    }
  })
}

onLoad(options => {
  mode.value = options.mode || 'normal'
})

onShow(loadAddress)
</script>

<style scoped lang="scss">
.address-list-page {
  padding-bottom: 160rpx;
}

.list {
  padding: 24rpx;
}

.address-card {
  margin-bottom: 20rpx;
  padding: 26rpx;
}

.main {
  padding-bottom: 22rpx;
}

.receiver {
  display: flex;
  align-items: center;
  color: #1f2430;
  font-size: 30rpx;
  font-weight: 900;
}

.receiver text:nth-child(2) {
  margin-left: 18rpx;
  font-size: 26rpx;
  font-weight: 600;
}

.default-tag {
  margin-left: 14rpx;
  padding: 4rpx 10rpx;
  border-radius: 8rpx;
  background: #fff2ef;
  color: #ff4d3f;
  font-size: 20rpx;
}

.address {
  display: block;
  margin-top: 14rpx;
  color: #7d8494;
  font-size: 26rpx;
  line-height: 40rpx;
}

.actions {
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f2f7;
  display: flex;
  justify-content: flex-end;
}

.action {
  margin-left: 28rpx;
  color: #5d6475;
  font-size: 24rpx;
}

.action.danger {
  color: #ff4d3f;
}

.bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 120rpx;
  padding: 18rpx 24rpx;
  background: #ffffff;
  box-shadow: 0 -8rpx 28rpx rgba(31, 36, 48, 0.08);
}
</style>
