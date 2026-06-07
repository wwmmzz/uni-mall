<template>
  <view class="page favorite-page safe-bottom">
    <view v-if="favoriteList.length" class="product-grid">
      <ProductCard
        v-for="item in favoriteList"
        :key="item.id"
        :item="item"
        :show-cart="true"
        @card-click="goDetail"
        @add-cart="handleAddCart"
      />
    </view>

    <EmptyState
      v-else
      icon="⭐"
      title="暂无收藏"
      desc="收藏喜欢的商品，方便下次快速找到"
      button-text="去首页逛逛"
      @action="goHome"
    />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import ProductCard from '@/components/ProductCard/ProductCard.vue'
import EmptyState from '@/components/EmptyState/EmptyState.vue'
import { getFavorites } from '@/api/favorite.js'
import { getProductDetail } from '@/api/product.js'
import { addCartItem } from '@/api/cart.js'
import { requireLogin } from '@/utils/storage.js'

const favoriteList = ref([])

async function loadFavorites() {
  if (!requireLogin()) {
    favoriteList.value = []
    return
  }

  favoriteList.value = await getFavorites()
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

  const product = await getProductDetail(item.id)
  await addCartItem({
    productId: product.id,
    skuName: product.specs?.[0] || '默认规格',
    quantity: 1
  })

  uni.showToast({
    title: '已加入购物车',
    icon: 'success'
  })
}

function goHome() {
  uni.switchTab({
    url: '/pages/home/index'
  })
}

onShow(loadFavorites)
</script>

<style scoped lang="scss">
.favorite-page {
  padding: 24rpx;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22rpx;
}
</style>
