<template>
  <view class="page search-page safe-bottom">
    <view class="search-header">
      <view class="search-input">
        <text>🔍</text>
        <input
          v-model="keyword"
          type="text"
          confirm-type="search"
          placeholder="输入商品关键词"
          @confirm="handleSearch"
        />
      </view>
      <text class="cancel" @click="goBack">取消</text>
    </view>

    <view v-if="!keyword" class="panel">
      <view class="panel-title-row">
        <text class="panel-title">最近搜索</text>
        <text v-if="historyList.length" class="clear" @click="clearHistory">清空</text>
      </view>

      <view v-if="historyList.length" class="chips">
        <text
          v-for="item in historyList"
          :key="item"
          class="chip"
          @click="quickSearch(item)"
        >
          {{ item }}
        </text>
      </view>
      <view v-else class="empty-tip">暂无搜索记录</view>

      <view class="panel-title second">热门搜索</view>
      <view class="chips">
        <text
          v-for="item in hotKeywords"
          :key="item"
          class="chip hot"
          @click="quickSearch(item)"
        >
          {{ item }}
        </text>
      </view>
    </view>

    <view v-else class="result-area">
      <view class="result-title">
        <text>搜索结果</text>
        <text>{{ resultList.length }} 件商品</text>
      </view>

      <view v-if="resultList.length" class="product-grid">
        <ProductCard
          v-for="item in resultList"
          :key="item.id"
          :item="item"
          @card-click="goDetail"
          @add-cart="handleAddCart"
        />
      </view>

      <EmptyState
        v-else
        icon="🔎"
        title="没有找到相关商品"
        desc="换个关键词试试，比如手机、耳机、坚果"
      />
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import ProductCard from '@/components/ProductCard/ProductCard.vue'
import EmptyState from '@/components/EmptyState/EmptyState.vue'
import { searchProducts } from '@/common/mock.js'
import {
  addToCart,
  getSearchHistory,
  addSearchHistory,
  clearSearchHistory
} from '@/utils/storage.js'

const keyword = ref('')
const historyList = ref([])
const hotKeywords = ['手机', '耳机', '洁面', '坚果', '沙发', '跑步鞋']

const resultList = computed(() => searchProducts(keyword.value))

function refreshHistory() {
  historyList.value = getSearchHistory()
}

function handleSearch(event) {
  const value = event.detail.value || keyword.value
  keyword.value = value.trim()

  if (keyword.value) {
    historyList.value = addSearchHistory(keyword.value)
  }
}

function quickSearch(value) {
  keyword.value = value
  historyList.value = addSearchHistory(value)
}

function clearHistory() {
  clearSearchHistory()
  refreshHistory()
}

function handleAddCart(item) {
  addToCart(item)

  uni.showToast({
    title: '已加入购物车',
    icon: 'success'
  })
}

function goDetail(item) {
  uni.navigateTo({
    url: `/pages/product/detail?id=${item.id}`
  })
}

function goBack() {
  uni.navigateBack()
}

onLoad(options => {
  refreshHistory()

  if (options.keyword) {
    keyword.value = decodeURIComponent(options.keyword)
    historyList.value = addSearchHistory(keyword.value)
  }
})
</script>

<style scoped lang="scss">
.search-page {
  padding-bottom: 40rpx;
}

.search-header {
  padding: 20rpx 24rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
}

.search-input {
  flex: 1;
  height: 76rpx;
  padding: 0 22rpx;
  border-radius: 38rpx;
  background: #f4f6fa;
  display: flex;
  align-items: center;
}

.search-input input {
  flex: 1;
  margin-left: 12rpx;
  color: #1f2430;
  font-size: 28rpx;
}

.cancel {
  margin-left: 22rpx;
  color: #5d6475;
  font-size: 28rpx;
}

.panel {
  padding: 30rpx 24rpx;
}

.panel-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-title {
  color: #1f2430;
  font-size: 30rpx;
  font-weight: 900;
}

.clear {
  color: #9aa1b2;
  font-size: 24rpx;
}

.second {
  display: block;
  margin-top: 44rpx;
}

.chips {
  margin-top: 22rpx;
  display: flex;
  flex-wrap: wrap;
}

.chip {
  margin-right: 16rpx;
  margin-bottom: 16rpx;
  padding: 14rpx 22rpx;
  border-radius: 28rpx;
  background: #ffffff;
  color: #5d6475;
  font-size: 26rpx;
}

.chip.hot {
  color: #ff4d3f;
  background: #fff2ef;
}

.empty-tip {
  margin-top: 24rpx;
  color: #a0a6b5;
  font-size: 26rpx;
}

.result-area {
  padding: 24rpx;
}

.result-title {
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  color: #8a91a4;
  font-size: 24rpx;
}

.result-title text:first-child {
  color: #1f2430;
  font-size: 30rpx;
  font-weight: 900;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22rpx;
}
</style>
