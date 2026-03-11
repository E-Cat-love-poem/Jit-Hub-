<template>
  <view class="page">
    <view class="test"></view>
    <view class="header">想要了解更多或是想加入维护小组？？</view>
    
    <navigator url="/pages/about/about">
      <view class="body">
        <image src="/static/images/logo.png" mode="aspectFit"></image>
      </view>
    </navigator>
    
    <!-- 新增上传盒子 -->
    <view class="upload-box">
      <view class="upload-title">或者您有更好的课程？请在此上传</view>
      <navigator url="/pages/upload/upload" class="upload-link">
        <button class="upload-btn">
          <text class="upload-btn-text">点击上传</text>
          <text class="upload-btn-icon">↑</text>
        </button>
      </navigator>
    </view>
    
    <view class="foot">
      <text class="foot-item">点击图标进入联系页面：</text>
      <text class="foot-item">我们从未有目的，只是在为爱发电</text>
      <text class="foot-item">团队中拥有实战项目丰富经验的负责人！！！</text>
      <text class="foot-item">此项目致敬Github网站</text>
    </view>
  </view>
</template>

<script>
export default {
  // 生命周期函数保持不变
  onLoad(options) {
    console.log('页面加载', options)
  },
  
  onShow() {
    console.log('页面显示')
  }
}
</script>

<style scoped>
/* 页面样式 */
.page {
  box-sizing: border-box;
  padding-bottom: calc(env(safe-area-inset-bottom) + 96rpx);
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-color: #f8f1e7; /* 添加统一的背景色 */
}

.test {
  height: 150rpx;
}

/* 加大标题字体 */
.header {
  padding: 40rpx 0 40rpx 40rpx;
  font-size: 48rpx; /* 从42rpx增大到48rpx */
  font-weight: bold; /* 使用bold，bolder在某些手机上可能不兼容 */
  color: #5a3921; /* 使用主题色 */
  margin-top: 20rpx;
  line-height: 1.4;
  letter-spacing: 1rpx; /* 添加字间距，看起来更舒服 */
}

.body {
  background-color: rgba(90, 57, 33, 0.1); /* 使用主题色半透明 */
  height: 600rpx;
  margin: 30rpx 50rpx;
  border-radius: 20rpx;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2rpx solid rgba(90, 57, 33, 0.2); /* 添加边框 */
}

.body:active {
  transform: scale(0.98);
  background-color: rgba(90, 57, 33, 0.15);
  box-shadow: 0 6rpx 20rpx rgba(90, 57, 33, 0.2);
}

/* 新增上传盒子样式 */
.upload-box {
  background: linear-gradient(135deg, rgba(212, 167, 98, 0.1), rgba(90, 57, 33, 0.1));
  height: auto;
  margin: 30rpx 50rpx;
  padding: 40rpx 35rpx 50rpx 55rpx;
  border-radius: 20rpx;
  border: 2rpx solid rgba(90, 57, 33, 0.2);
  box-shadow: 0 4rpx 15rpx rgba(90, 57, 33, 0.1);
}

.upload-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #5a3921;
  text-align: center;
  margin-bottom: 40rpx;
  line-height: 1.5;
}

.upload-link {
  display: block;
  text-decoration: none;
  width: 100%;
}

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100rpx;
  background: linear-gradient(135deg, #d4a762, #b89350);
  border: none;
  border-radius: 50rpx;
  color: white;
  font-size: 36rpx;
  font-weight: bold;
  box-shadow: 0 6rpx 20rpx rgba(180, 140, 80, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.upload-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.upload-btn:active {
  transform: translateY(4rpx);
  box-shadow: 0 2rpx 10rpx rgba(180, 140, 80, 0.3);
}

.upload-btn:active::after {
  opacity: 1;
}

.upload-btn-text {
  margin-right: 15rpx;
  letter-spacing: 2rpx;
}

.upload-btn-icon {
  font-size: 42rpx;
  font-weight: bold;
  transform: translateY(-2rpx);
}

/* 加大脚注字体 */
.foot {
  background-color: rgba(212, 167, 98, 0.15); /* 使用金色半透明 */
  height: auto;
  min-height: 250rpx; /* 增加最小高度 */
  margin: 25rpx 50rpx;
  padding: 40rpx 35rpx 40rpx 55rpx; /* 增加内边距 */
  border-radius: 20rpx;
  border: 2rpx solid rgba(212, 167, 98, 0.3);
}

/* 加大文本字体 */
.foot-item {
  display: block;
  font-size: 38rpx; /* 从32rpx增大到38rpx */
  line-height: 1.8; /* 增加行高 */
  color: #5a3921; /* 使用主题色 */
  margin-bottom: 25rpx; /* 增加间距 */
  padding-left: 10rpx;
  border-left: 4rpx solid #d4a762; /* 添加装饰线 */
}

.foot-item:last-child {
  margin-bottom: 0;
}

/* 特殊强调最后一句 */
.foot-item:last-child {
  color: #c33b2b; /* 特殊强调色 */
  font-weight: bold;
  font-size: 40rpx;
  border-left-color: #c33b2b;
}

image {
  height: 100%;
  width: 100%;
  object-fit: contain;
  padding: 30rpx; /* 增加图片内边距 */
}

/* 点击效果 */
navigator {
  display: block;
  text-decoration: none;
}

/* 响应式设计 - 大屏 */
@media (min-width: 768px) {
  .header {
    font-size: 56rpx; /* 在大屏上更大 */
    padding: 50rpx 0 50rpx 80rpx;
    max-width: 1200rpx;
    margin: 0 auto;
  }
  
  .body {
    height: 700rpx;
    max-width: 1200rpx;
    margin: 40rpx auto;
    border-radius: 30rpx;
  }
  
  .upload-box {
    max-width: 1200rpx;
    margin: 40rpx auto;
    padding: 50rpx 50rpx 60rpx 50rpx;
    border-radius: 30rpx;
  }
  
  .upload-title {
    font-size: 46rpx;
    margin-bottom: 50rpx;
  }
  
  .upload-btn {
    height: 120rpx;
    font-size: 40rpx;
    border-radius: 60rpx;
    max-width: 600rpx;
    margin: 0 auto;
  }
  
  .upload-btn-icon {
    font-size: 48rpx;
  }
  
  .foot {
    max-width: 1200rpx;
    margin: 40rpx auto;
    padding: 50rpx 50rpx 50rpx 70rpx;
    border-radius: 30rpx;
  }
  
  .foot-item {
    font-size: 42rpx;
    line-height: 2;
    margin-bottom: 30rpx;
  }
  
  .foot-item:last-child {
    font-size: 44rpx;
  }
}

/* 响应式设计 - 小屏 */
@media (max-width: 480px) {
  .header {
    font-size: 40rpx;
    padding: 30rpx 0 30rpx 30rpx;
  }
  
  .body {
    height: 500rpx;
    margin: 20rpx 30rpx;
  }
  
  .upload-box {
    margin: 20rpx 30rpx;
    padding: 30rpx 25rpx 40rpx 25rpx;
  }
  
  .upload-title {
    font-size: 36rpx;
    margin-bottom: 30rpx;
  }
  
  .upload-btn {
    height: 90rpx;
    font-size: 32rpx;
  }
  
  .upload-btn-icon {
    font-size: 38rpx;
  }
  
  .foot {
    margin: 20rpx 30rpx;
    padding: 30rpx 25rpx 30rpx 35rpx;
  }
  
  .foot-item {
    font-size: 32rpx;
    line-height: 1.6;
    margin-bottom: 20rpx;
  }
  
  .foot-item:last-child {
    font-size: 34rpx;
  }
}

/* 平板设备适配 */
@media (min-width: 481px) and (max-width: 767px) {
  .header {
    font-size: 44rpx;
    padding: 35rpx 0 35rpx 40rpx;
  }
  
  .body {
    height: 550rpx;
    margin: 25rpx 40rpx;
  }
  
  .upload-box {
    margin: 25rpx 40rpx;
    padding: 35rpx 30rpx 45rpx 30rpx;
  }
  
  .upload-title {
    font-size: 42rpx;
    margin-bottom: 35rpx;
  }
  
  .upload-btn {
    height: 100rpx;
    font-size: 38rpx;
  }
  
  .upload-btn-icon {
    font-size: 44rpx;
  }
  
  .foot {
    margin: 25rpx 40rpx;
    padding: 35rpx 30rpx 35rpx 50rpx;
  }
  
  .foot-item {
    font-size: 36rpx;
    line-height: 1.7;
    margin-bottom: 22rpx;
  }
  
  .foot-item:last-child {
    font-size: 38rpx;
  }
}

/* 防止背景图在部分浏览器中不显示 */
@supports not (background-attachment: fixed) {
  .page {
    background-attachment: scroll;
  }
}

/* 添加优雅的进入动画 */
.page {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 为可点击元素添加光标提示 */
.body, .upload-btn {
  cursor: pointer;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .page {
    background-color: #1a1a1a;
  }
  
  .header {
    color: #e6e6e6;
  }
  
  .body {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  .upload-box {
    background: linear-gradient(135deg, rgba(212, 167, 98, 0.15), rgba(90, 57, 33, 0.15));
    border-color: rgba(212, 167, 98, 0.3);
  }
  
  .upload-title {
    color: #e6e6e6;
  }
  
  .upload-btn {
    background: linear-gradient(135deg, #b89350, #9a7a40);
  }
  
  .foot {
    background-color: rgba(212, 167, 98, 0.2);
    border-color: rgba(212, 167, 98, 0.3);
  }
  
  .foot-item {
    color: #e6e6e6;
    border-left-color: #d4a762;
  }
  
  .foot-item:last-child {
    color: #ff6b6b;
    border-left-color: #ff6b6b;
  }
}

/* 上传按钮悬停效果（在支持悬停的设备上） */
@media (hover: hover) and (pointer: fine) {
  .upload-btn:hover {
    transform: translateY(-2rpx);
    box-shadow: 0 8rpx 25rpx rgba(180, 140, 80, 0.4);
  }
  
  .upload-btn:hover::after {
    opacity: 1;
  }
}
</style>