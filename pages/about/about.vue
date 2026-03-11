<template>
  <view class="team-container">
    <!-- 页面标题 -->
    <view class="page-header">
      <text>关于我们</text>
    </view>

    <!-- 团队介绍卡片 -->
    <view class="team-card">
      <image class="team-logo" src="/static/images/logo1.png"></image>
      <text class="team-name">Jit-Hub学习平台</text>
      <text class="team-slogan">知识改变命运 · 学习成就未来</text>
    </view>

    <!-- 团队信息 -->
    <view class="info-section">
      <view class="info-item">
        <image class="info-icon" src="/static/images/logo.png"></image>
        <view class="info-content">
          <text class="info-title">平台使命</text>
          <text class="info-desc">为广大学子提供优质的学习资源，打造高效、便捷的在线学习环境</text>
        </view>
      </view>

      <view class="info-item">
        <image class="info-icon" src="/static/images/logo.png"></image>
        <view class="info-content">
          <text class="info-title">团队构成</text>
          <text class="info-desc">由一位努力学习程序知识的人和另一位了解前后端技术开发人员组成的学习小组</text>
        </view>
      </view>

      <view class="info-item">
        <image class="info-icon" src="/static/images/logo.png"></image>
        <view class="info-content">
          <text class="info-title">发展历程</text>
          <text class="info-desc">2023年入学，已学习3类编程语言，了解现代编程思路</text>
        </view>
      </view>
    </view>

    <!-- 联系方式 -->
    <view class="contact-section">
      <text class="section-title">联系我们</text>
      <view class="contact-item" @click="copyWechat">
        <image class="contact-icon" src="/static/images/WeChat.png"></image>
        <text>微信公众号: E-Cat-love-poem</text>
      </view>
      <view class="contact-item" @click="makePhoneCall">
        <image class="contact-icon" src="/static/images/WeChat.png"></image>
        <text>联系电话: 要三酒-啤酒白酒葡萄酒</text>
      </view>
      <view class="contact-item" @click="openEmail">
        <image class="contact-icon" src="/static/images/WeChat.png"></image>
        <text>电子邮箱: 广州软件学院-微信小程序开发@JE.Class</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 可以在这里定义动态数据
    }
  },

  onLoad(options) {
    // 页面加载时执行
    console.log('页面加载')
  },

  methods: {
    // 复制微信号
    copyWechat() {
      uni.setClipboardData({
        data: 'trad-crafts',
        success: () => {
          uni.showToast({
            title: '已复制微信号',
            icon: 'success'
          })
        },
        fail: (err) => {
          console.error('复制失败:', err)
          uni.showToast({
            title: '复制失败',
            icon: 'none'
          })
        }
      })
    },

    // 拨打电话
    makePhoneCall() {
      uni.makePhoneCall({
        phoneNumber: '要三酒-啤酒白酒葡萄酒',
        success: () => {
          console.log('拨打电话成功')
        },
        fail: (err) => {
          console.error('拨打电话失败:', err)
          uni.showToast({
            title: '拨号失败',
            icon: 'none'
          })
        }
      })
    },

    // 发送邮件
    openEmail() {
      uni.showModal({
        title: '发送邮件',
        content: '是否要发送邮件到 广州软件学院-微信小程序应用开发@JE.Class？',
        success: (res) => {
          if (res.confirm) {
            uni.setClipboardData({
              data: 'contact@trad-crafts.com',
              success: () => {
                uni.showToast({
                  title: '已发送邮箱地址',
                  icon: 'success'
                })
              },
              fail: (err) => {
                console.error('发送失败:', err)
                uni.showToast({
                  title: '发送失败',
                  icon: 'none'
                })
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
/* 基础样式 */
.team-container {
  padding: 20rpx;
  background-color: #f9f5f0;
  min-height: 100vh;
}

/* 页面标题 */
.page-header {
  text-align: center;
  padding: 30rpx 0;
  font-size: 36rpx;
  font-weight: bold;
  color: #5a3921;
}

/* 团队卡片 */
.team-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 40rpx;
  margin: 20rpx 0;
  text-align: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.team-logo {
  width: 150rpx;
  height: 150rpx;
  margin-bottom: 20rpx;
  border-radius: 50%;
}

.team-name {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
  color: #5a3921;
}

.team-slogan {
  display: block;
  font-size: 26rpx;
  color: #8d6e63;
}

/* 信息区块 */
.info-section {
  background-color: #fff;
  border-radius: 16rpx;
  margin: 20rpx 0;
  padding: 0 20rpx;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f0e6d9;
}

.info-item:last-child {
  border-bottom: none;
}

.info-icon {
  width: 50rpx;
  height: 50rpx;
  margin-right: 20rpx;
}

.info-content {
  flex: 1;
}

.info-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #5a3921;
  margin-bottom: 8rpx;
  display: block;
}

.info-desc {
  font-size: 26rpx;
  color: #8d6e63;
  display: block;
  line-height: 1.5;
}

/* 联系方式 */
.contact-section {
  background-color: #fff;
  border-radius: 16rpx;
  margin: 20rpx 0;
  padding: 30rpx 20rpx;
}

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #5a3921;
  margin-bottom: 25rpx;
  padding-bottom: 15rpx;
  border-bottom: 1rpx solid #f0e6d9;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  cursor: pointer;
  transition: all 0.2s;
}

.contact-item:active {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8rpx;
  transform: scale(0.99);
}

.contact-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 20rpx;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .team-container {
    max-width: 750rpx;
    margin: 0 auto;
    padding: 40rpx;
  }
  
  .page-header {
    font-size: 44rpx;
    padding: 40rpx 0;
  }
  
  .team-card {
    padding: 60rpx 40rpx;
  }
  
  .team-logo {
    width: 180rpx;
    height: 180rpx;
  }
  
  .team-name {
    font-size: 38rpx;
  }
  
  .team-slogan {
    font-size: 30rpx;
  }
  
  .info-section,
  .contact-section {
    padding: 40rpx;
  }
  
  .info-title {
    font-size: 32rpx;
  }
  
  .info-desc {
    font-size: 28rpx;
  }
  
  .section-title {
    font-size: 34rpx;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .team-container {
    background-color: #1a1a1a;
  }
  
  .page-header {
    color: #e6e6e6;
  }
  
  .team-card,
  .info-section,
  .contact-section {
    background-color: #2d2d2d;
  }
  
  .team-name {
    color: #e6e6e6;
  }
  
  .team-slogan,
  .info-desc {
    color: #b3b3b3;
  }
  
  .info-title,
  .section-title {
    color: #e6e6e6;
  }
  
  .info-item {
    border-bottom-color: #404040;
  }
  
  .section-title {
    border-bottom-color: #404040;
  }
  
  .contact-item:active {
    background-color: rgba(255, 255, 255, 0.05);
  }
}
</style>