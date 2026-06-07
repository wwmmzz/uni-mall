<template>
  <view class="page home-page safe-bottom">
    <view class="top-area">
      <view class="location-row">
        <view>
          <text class="hello">欢迎来到</text>
          <text class="brand">优选商城</text>
        </view>
        <view class="notice" @click="showNotice">
          <text>🔔</text>
        </view>
      </view>

      <view class="search-bar" @click="goSearch">
        <text class="search-icon">🔍</text>
        <text class="search-placeholder">搜索手机、护肤、生鲜好物</text>
      </view>
    </view>

    <swiper class="banner-swiper" circular autoplay interval="3200" duration="450">
      <swiper-item v-for="banner in banners" :key="banner.id">
        <view class="banner-card" :style="{ background: banner.gradient }" @click="goSearch">
          <view>
            <text class="banner-title">{{ banner.title }}</text>
            <text class="banner-subtitle">{{ banner.subtitle }}</text>
            <view class="banner-btn">{{ banner.buttonText }}</view>
          </view>
          <!-- <view class="banner-bubble">
            <text>SALE</text>
          </view> -->
        </view>
      </swiper-item>
    </swiper>

    <view class="category-card card">
      <view
        v-for="item in categoryShortcuts"
        :key="item.id"
        class="category-item"
        @click="goCategory(item)"
      >
        <view class="category-icon">{{ item.icon }}</view>
        <text class="category-name">{{ item.name }}</text>
      </view>
    </view>

    <SectionTitle title="限时秒杀" sub-title="好价不用等" more-text="全部" @more="goCategory({ id: 'all' })" />
    <scroll-view class="flash-scroll" scroll-x show-scrollbar="false">
      <view class="flash-list">
        <view
          v-for="item in hotProducts"
          :key="item.id"
          class="flash-item card"
          @click="goDetail(item)"
        >
          <view class="flash-cover" :style="{ background: item.gradient }">
            <text>{{ item.coverText }}</text>
          </view>
          <text class="flash-title line-1">{{ item.title }}</text>
          <view class="flash-price">
            <text>¥{{ money(item.price) }}</text>
            <text class="old-price">¥{{ money(item.oldPrice) }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <SectionTitle title="猜你喜欢" sub-title="为你精选" />
    <view class="product-grid">
      <ProductCard
        v-for="item in recommendProducts"
        :key="item.id"
        :item="item"
        @card-click="goDetail"
        @add-cart="handleAddCart"
      />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import ProductCard from '@/components/ProductCard/ProductCard.vue'
import SectionTitle from '@/components/SectionTitle/SectionTitle.vue'
import { getHomeData } from '@/api/home.js'
import { addCartItem } from '@/api/cart.js'
import { money, requireLogin } from '@/utils/storage.js'

const banners = ref([])
const categoryShortcuts = ref([])
const hotProducts = ref([])
const recommendProducts = ref([])

async function loadHomeData() {
  const res = await getHomeData()
  banners.value = res.banners || []
  categoryShortcuts.value = res.categoryShortcuts || []
  hotProducts.value = res.hotProducts || []
  recommendProducts.value = res.newProducts || []
}

function goSearch() {
  uni.navigateTo({
    url: '/pages/search/search'
  })
}

function goCategory(item) {
  uni.setStorageSync('UMALL_CATEGORY_TARGET', item.id)
  uni.switchTab({
    url: '/pages/category/category'
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

function showNotice() {
  uni.showToast({
    title: '暂无新消息',
    icon: 'none'
  })
}

onLoad(() => {
  loadHomeData()
})

onPullDownRefresh(() => {
  loadHomeData().finally(() => {
    uni.stopPullDownRefresh()
    uni.showToast({
      title: '刷新成功',
      icon: 'none'
    })
  })
})
</script>

<style scoped lang="scss">
.home-page {
  padding-bottom: 36rpx;
}

.top-area {
  padding: 28rpx 24rpx 22rpx;
  background: linear-gradient(180deg, #ffffff 0%, #f6f7fb 100%);
}

.location-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hello {
  display: block;
  color: #8a91a4;
  font-size: 24rpx;
}

.brand {
  display: block;
  margin-top: 6rpx;
  color: #1f2430;
  font-size: 42rpx;
  font-weight: 900;
}

.notice {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(31, 36, 48, 0.06);
}

.search-bar {
  height: 80rpx;
  margin-top: 26rpx;
  padding: 0 28rpx;
  border-radius: 40rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  box-shadow: 0 10rpx 30rpx rgba(31, 36, 48, 0.06);
}

.search-icon {
  margin-right: 14rpx;
  font-size: 28rpx;
}

.search-placeholder {
  color: #a0a6b5;
  font-size: 26rpx;
}

.banner-swiper {
  height: 300rpx;
  margin: 0 24rpx;
}

.banner-card {
  height: 260rpx;
  padding: 42rpx;
  border-radius: 30rpx;
  display: flex;
  justify-content: space-between;
  color: #ffffff;
  overflow: hidden;
}

.banner-title {
  display: block;
  font-size: 42rpx;
  font-weight: 900;
}

.banner-subtitle {
  display: block;
  margin-top: 14rpx;
  font-size: 26rpx;
  opacity: 0.9;
}

.banner-btn {
  width: 156rpx;
  height: 54rpx;
  margin-top: 28rpx;
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.24);
  text-align: center;
  line-height: 54rpx;
  font-size: 24rpx;
}

.banner-bubble {
  width: 150rpx;
  height: 150rpx;
  margin-top: 8rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34rpx;
  font-weight: 900;
}

.category-card {
  margin: 0 24rpx;
  padding: 28rpx 8rpx 12rpx;
  display: flex;
  flex-wrap: wrap;
}

.category-item {
  width: 25%;
  margin-bottom: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.category-icon {
  width: 82rpx;
  height: 82rpx;
  border-radius: 30rpx;
  background: #fff4f2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
}

.category-name {
  margin-top: 12rpx;
  color: #4d5363;
  font-size: 24rpx;
}

.flash-scroll {
  width: 100%;
  white-space: nowrap;
}

.flash-list {
  display: flex;
  padding: 0 24rpx 4rpx;
}

.flash-item {
  width: 218rpx;
  margin-right: 20rpx;
  padding: 14rpx;
  flex-shrink: 0;
}

.flash-cover {
  height: 150rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: flex-end;
  padding: 18rpx;
}

.flash-cover text {
  color: rgba(31, 36, 48, 0.72);
  font-size: 24rpx;
  font-weight: 700;
}

.flash-title {
  display: block;
  margin-top: 14rpx;
  color: #1f2430;
  font-size: 24rpx;
}

.flash-price {
  margin-top: 10rpx;
  display: flex;
  align-items: baseline;
  color: #ff4d3f;
  font-size: 28rpx;
  font-weight: 800;
}

.old-price {
  margin-left: 8rpx;
  color: #b6bdca;
  font-size: 20rpx;
  text-decoration: line-through;
  font-weight: 400;
}

.product-grid {
  padding: 0 24rpx 40rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22rpx;
}
</style>
