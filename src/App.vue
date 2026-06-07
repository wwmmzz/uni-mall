<script>
export default {
  onLaunch() {
    console.log('uni 商城小程序启动')
  },
  onShow() {
    console.log('uni 商城小程序显示')
  },
  onHide() {
    console.log('uni 商城小程序隐藏')
  }
}
</script>

<style lang="scss">
@import './uni.scss';

page {
  min-height: 100%;
  background: #f6f7fb;
  color: #1f2430;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

view,
text,
scroll-view,
swiper,
swiper-item,
image,
button,
input,
textarea {
  box-sizing: border-box;
}

button {
  padding: 0;
  margin: 0;
  border-radius: 0;
  background: transparent;
  line-height: 1;
}

button::after {
  border: 0;
}

.safe-bottom {
  padding-bottom:calc(24rpx + env(safe-area-inset-bottom));
}

.page {
  min-height: 100vh;
  background: #f6f7fb;
}

.card {
  background: #ffffff;
  border-radius: 24rpx;
  box-shadow: 0 10rpx 30rpx rgba(31, 36, 48, 0.05);
}

.primary-btn {
  height: 88rpx;
  border-radius: 44rpx;
  background: linear-gradient(135deg, #ff5a3c 0%, #ff2d55 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 600;
}

.ghost-btn {
  height: 72rpx;
  border-radius: 36rpx;
  border: 2rpx solid #ff5a3c;
  color: #ff5a3c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  background: #fff7f5;
}

.line-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.line-2 {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
