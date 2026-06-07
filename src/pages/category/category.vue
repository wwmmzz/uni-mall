<template>
  <view class="page category-page">
    <view class="search-mini" @click="goSearch">
      <text>🔍</text>
      <text class="placeholder">搜索你想买的商品</text>
    </view>

    <view class="layout">
      <scroll-view class="sidebar" scroll-y>
        <view
          v-for="item in categoryTabs"
          :key="item.id"
          class="side-item"
          :class="{ active: activeCategory === item.id }"
          @click="activeCategory = item.id"
        >
          <text>{{ item.name }}</text>
        </view>
      </scroll-view>

      <scroll-view class="content" scroll-y>
        <view class="category-banner" :style="{ background: currentGradient }">
          <text class="banner-title">{{ currentCategoryName }}</text>
          <text class="banner-desc">精选好物 · 正品保障 · 极速发货</text>
        </view>

        <view class="count-row">
          <text>共 {{ productList.length }} 件商品</text>
          <text class="sort">综合排序</text>
        </view>

        <view class="product-grid">
          <ProductCard
            v-for="item in productList"
            :key="item.id"
            :item="item"
            @card-click="goDetail"
            @add-cart="handleAddCart"
          />
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import ProductCard from '@/components/ProductCard/ProductCard.vue'
import { getCategories } from '@/api/home.js'
import { getProducts } from '@/api/product.js'
import { addCartItem } from '@/api/cart.js'
import { categoryGradientMap } from '@/common/constants.js'
import { requireLogin } from '@/utils/storage.js'

const activeCategory = ref('all')
const categoryTabs = ref([{ id: 'all', name: '全部' }])
const productList = ref([])

async function loadCategoryTabs() {
  const list = await getCategories()
  categoryTabs.value = [{ id: 'all', name: '全部' }, ...list]
}

async function loadProductsByCategory() {
  const res = await getProducts({
    categoryId: activeCategory.value,
    page: 1,
    pageSize: 50
  })
  productList.value = res.list || []
}

const currentCategoryName = computed(() => {
  const target = categoryTabs.find(item => item.id === activeCategory.value)
  return target ? target.name : '全部'
})

const currentGradient = computed(() => {
  return categoryGradientMap[activeCategory.value] || categoryGradientMap.all
})

function goSearch() {
  uni.navigateTo({
    url: '/pages/search/search'
  })
}

function goDetail(item) {
  uni.navigateTo({
    url: `/pages/product/detail?id=${item.id}`
  })
}

async function handleAddCart(item) {
  if (!requireLogin()) {
    return
  }

  await addCartItem({
    productId: item.id,
    skuName: item.specs?.[0] || '默认规格',
    quantity: 1
  })

  uni.showToast({
    title: '已加入购物车',
    icon: 'success'
  })
}

watch(activeCategory, () => {
  loadProductsByCategory()
})

onLoad(() => {
  loadCategoryTabs()
  loadProductsByCategory()
})

onShow(() => {
  const target = uni.getStorageSync('UMALL_CATEGORY_TARGET')

  if (target) {
    activeCategory.value = target
    uni.removeStorageSync('UMALL_CATEGORY_TARGET')
  }
})
</script>

<style scoped lang="scss">
.category-page {
  display: flex;
  flex-direction: column;
}

.search-mini {
  height: 76rpx;
  margin: 20rpx 24rpx;
  padding: 0 26rpx;
  border-radius: 38rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  box-shadow: 0 8rpx 24rpx rgba(31, 36, 48, 0.05);
}

.placeholder {
  margin-left: 12rpx;
  color: #a0a6b5;
  font-size: 26rpx;
}

.layout {
  flex: 1;
  height: calc(100vh - 116rpx);
  display: flex;
}

.sidebar {
  width: 180rpx;
  height: 100%;
  background: #f0f2f7;
}

.side-item {
  position: relative;
  height: 104rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5d6475;
  font-size: 26rpx;
}

.side-item.active {
  background: #ffffff;
  color: #ff4d3f;
  font-weight: 800;
}

.side-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  width: 8rpx;
  height: 36rpx;
  border-radius: 0 8rpx 8rpx 0;
  background: #ff4d3f;
}

.content {
  flex: 1;
  height: 100%;
  padding: 0 20rpx 30rpx;
}

.category-banner {
  height: 168rpx;
  margin-bottom: 24rpx;
  padding: 32rpx;
  border-radius: 24rpx;
  color: #ffffff;
}

.banner-title {
  display: block;
  font-size: 36rpx;
  font-weight: 900;
}

.banner-desc {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  opacity: 0.9;
}

.count-row {
  margin-bottom: 20rpx;
  padding: 0 6rpx;
  display: flex;
  justify-content: space-between;
  color: #8a91a4;
  font-size: 24rpx;
}

.sort {
  color: #ff4d3f;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18rpx;
  padding-bottom: 40rpx;
}
</style>
