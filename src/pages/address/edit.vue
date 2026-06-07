<template>
  <view class="page address-edit-page safe-bottom">
    <view class="form-card card">
      <view class="field">
        <text class="label">收货人</text>
        <input v-model="form.name" placeholder="请填写收货人姓名" />
      </view>
      <view class="field">
        <text class="label">手机号</text>
        <input v-model="form.phone" type="number" maxlength="11" placeholder="请填写手机号" />
      </view>
      <view class="field">
        <text class="label">省份</text>
        <input v-model="form.province" placeholder="例如：广东省" />
      </view>
      <view class="field">
        <text class="label">城市</text>
        <input v-model="form.city" placeholder="例如：深圳市" />
      </view>
      <view class="field">
        <text class="label">区县</text>
        <input v-model="form.district" placeholder="例如：南山区" />
      </view>
      <view class="field textarea-field">
        <text class="label">详细地址</text>
        <textarea v-model="form.detail" placeholder="街道、楼牌号等详细信息" />
      </view>
      <view class="field switch-field">
        <text class="label">设为默认地址</text>
        <switch :checked="form.isDefault" color="#ff4d3f" @change="handleSwitch" />
      </view>
    </view>

    <view class="submit-area">
      <view class="primary-btn" @click="save">保存地址</view>
    </view>
  </view>
</template>

<script setup>
import { reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getAddressById, upsertAddress } from '@/utils/storage.js'

const form = reactive({
  id: '',
  name: '',
  phone: '',
  province: '广东省',
  city: '深圳市',
  district: '南山区',
  detail: '',
  isDefault: false
})

function handleSwitch(event) {
  form.isDefault = event.detail.value
}

function validate() {
  if (!form.name.trim()) return '请填写收货人姓名'
  if (!/^1\d{10}$/.test(form.phone)) return '请填写正确的手机号'
  if (!form.province.trim() || !form.city.trim() || !form.district.trim()) return '请填写完整省市区'
  if (!form.detail.trim()) return '请填写详细地址'
  return ''
}

function save() {
  const message = validate()

  if (message) {
    uni.showToast({
      title: message,
      icon: 'none'
    })
    return
  }

  upsertAddress({
    id: form.id,
    name: form.name,
    phone: form.phone,
    province: form.province,
    city: form.city,
    district: form.district,
    detail: form.detail,
    isDefault: form.isDefault
  })

  uni.showToast({
    title: '保存成功',
    icon: 'success'
  })

  setTimeout(() => {
    uni.navigateBack()
  }, 500)
}

onLoad(options => {
  if (!options.id) return

  const target = getAddressById(options.id)

  if (target) {
    Object.assign(form, target)
  }
})
</script>

<style scoped lang="scss">
.address-edit-page {
  padding: 24rpx;
}

.form-card {
  overflow: hidden;
}

.field {
  min-height: 100rpx;
  padding: 0 26rpx;
  display: flex;
  align-items: center;
  border-bottom: 1rpx solid #f0f2f7;
}

.field:last-child {
  border-bottom: 0;
}

.label {
  width: 180rpx;
  color: #1f2430;
  font-size: 28rpx;
  font-weight: 700;
}

.field input {
  flex: 1;
  color: #1f2430;
  font-size: 28rpx;
}

.textarea-field {
  align-items: flex-start;
  padding-top: 26rpx;
  padding-bottom: 26rpx;
}

.textarea-field textarea {
  flex: 1;
  min-height: 150rpx;
  color: #1f2430;
  font-size: 28rpx;
  line-height: 40rpx;
}

.switch-field {
  justify-content: space-between;
}

.switch-field .label {
  flex: 1;
}

.submit-area {
  margin-top: 36rpx;
}
</style>
