<template>
  <view class="index">
    <!-- 头部用户信息区域 -->
    <view class="header">
      <view class="box-1">
        <image src="/static/images/头像.png"></image>
      </view>
      <view class="box-2">
        <view><text style="font-size: 30rpx;">名称：{{ userInfo.name || '未登录用户' }}</text></view>
        <view><text style="font-size: 30rpx;">ID：{{ userInfo.userId || '--' }}</text></view>
      </view>
      <view class="bt">
        <button @click="navigateToEditProfile" size="mini"><text>关于我们</text></button>
      </view>
    </view>

    <!-- 等级进度区域 -->
    <view class="body">
      <view>
        <text style="font-size: 60rpx;">等级：{{ userInfo.level || 'Lv.0' }}</text>
        <progress 
          :percent="userInfo.levelProgress || 0" 
          activeColor="#52CC52" 
          backgroundColor="#EBEBEB" 
          stroke-width="10" 
          show-info
        ></progress>
        <view class="box"></view>
      </view>
    </view>

    <!-- 功能菜单区域 -->
    <view class="foot">
      <view class="menu-list">
        <view class="menu-item" @click="navigateToOrder">
          <image src="/static/images/购物车.png"></image>
          <text>我的课程</text>
        </view>
        <view class="menu-item" @click="navigateToAddress">
          <image src="/static/images/APP.png"></image>
          <text>我想学习</text>
        </view>
        <view class="menu-item" @click="navigateToSettings">
          <image src="/static/images/灯.png"></image>
          <text>设置</text>
        </view>
        <view class="menu-item" @click="handleEasterEgg">
          <image src="/static/images/404.png"></image>
          <text>别点!!!点了项目会崩溃的！！！</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue'
import { get } from '@/utils/request'

export default {
  setup() {
    const clickCount = ref(0)
    const userInfo = ref({
      name: '未登录用户',
      userId: '--',
      level: 'Lv.0',
      levelProgress: 0
    })

    // 加载用户信息
    const loadUserInfo = async () => {
      try {
        // 1. 从本地缓存获取登录信息
        const cachedUserInfo = uni.getStorageSync('userInfo') || {}
        const userId = cachedUserInfo.userId
        console.log('用户ID:', userId)
        
        if (!userId) {
          console.log('未检测到登录信息')
          return
        }

        // 2. 调用API获取用户数据
        const res = await get(`/user/info?userId=${Number(userId)}`)
        console.log("完整响应:", res)

        // 3. 更新页面数据
        userInfo.value = {
          ...userInfo.value,
          name: res.user_name || '未知用户',
          userId: res.user_id,
          level: 'Lv.3',
          levelProgress: 65
        }
        
      } catch (error) {
        console.error('加载用户信息失败:', error)
        uni.showToast({
          title: '加载用户信息失败: ' + (error.message || '未知错误'),
          icon: 'none',
          duration: 2000
        })
      }
    }

    // 跳转到关于页面
    const navigateToEditProfile = () => {
      uni.navigateTo({
        url: '/pages/about/about',
        success: () => console.log('跳转到关于页面')
      })
    }

    // 跳转到订单页面
    const navigateToOrder = () => {
      uni.switchTab({
        url: '/pages/shop/shop',
        success: () => console.log('跳转到订单页'),
        fail: (err) => {
          console.log('跳转失败:', err)
          uni.showToast({
            title: '跳转失败',
            icon: 'none'
          })
        }
      })
    }

    // 跳转到地址管理
    const navigateToAddress = () => {
      uni.switchTab({
        url: '/pages/yue/yue',
        success: () => console.log('跳转到地址管理'),
        fail: (err) => {
          console.log('跳转失败:', err)
          uni.showToast({
            title: '跳转失败',
            icon: 'none'
          })
        }
      })
    }

    // 跳转到设置页面
    const navigateToSettings = () => {
      uni.showModal({
        title: '提示',
        content: '设置功能正在开发中，敬请期待',
        showCancel: false,
        confirmText: '我知道了',
        success: (res) => {
          if (res.confirm) {
            console.log('用户点击了我知道了')
          }
        }
      })
    }

    // 彩蛋处理
    const handleEasterEgg = () => {
      const newCount = clickCount.value + 1
      clickCount.value = newCount
      
      // 使用对象映射替代switch-case
      const eggActions = {
        1: () => showModal('我知道你是手滑', '别点昂，点了你项目组长会发出尖锐爆鸣声~'),
        3: () => showModal('🤬 你还点呢？！', '别点了，项目崩了你负责吗？！'),
        5: () => showModal('⚠项目即将崩塌！⚠', '崩了，再点真崩了！！', true),
        7: () => {
          clickCount.value = 0
          showModal('好了？开心了？给我滚去重新登录！', '', false, () => {
            uni.navigateTo({ 
              url: '/pages/Login/Login',
              fail: (err) => {
                console.log('跳转到404失败:', err)
              }
            })
          })
        }
      }
      
      eggActions[newCount]?.()
    }

    // 封装通用的模态框显示
    const showModal = (title, content, vibrate = false, callback) => {
      uni.showModal({
        title,
        content,
        showCancel: false,
        confirmText: vibrate ? '搞你心态' : '真的假的',
        confirmColor: '#07C160',
        success: () => {
          if (vibrate) uni.vibrateShort()
          callback?.()
        }
      })
    }

    return {
      userInfo,
      navigateToEditProfile,
      navigateToOrder,
      navigateToAddress,
      navigateToSettings,
      handleEasterEgg
    }
  },

  // uni-app 生命周期钩子
  onLoad() {
    this.loadUserInfo()
  },

  onShow() {
    // 每次页面显示都刷新数据
    this.loadUserInfo()
  },

  methods: {
    // 将setup中的函数也暴露给options API
    loadUserInfo() {
      // 这里需要访问setup返回的userInfo，所以需要重新实现
      const cachedUserInfo = uni.getStorageSync('userInfo') || {}
      const userId = cachedUserInfo.userId
      
      if (!userId) {
        console.log('未检测到登录信息')
        return
      }

      get(`/user/info?userId=${Number(userId)}`)
        .then(res => {
          this.userInfo = {
            ...this.userInfo,
            name: res.user_name || '未知用户',
            userId: res.user_id,
            level: 'Lv.3',
            levelProgress: 65
          }
        })
        .catch(error => {
          console.error('加载用户信息失败:', error)
          uni.showToast({
            title: '加载用户信息失败',
            icon: 'none',
            duration: 2000
          })
        })
    }
  }
}
</script>

<style scoped>
.index {
  min-height: 100vh;
  background-color: #f8f1e9;
}

/* 头部样式 */
.header {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
}

.box-1 image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 2rpx solid #eee;
}

.box-2 {
  flex: 1;
  margin-left: 30rpx;
}

.bt button {
  margin: 0;
  font-size: 24rpx;
  line-height: 1.5;
  background-color: #07C160;
  color: white;
  border: none;
}

.bt button:active {
  opacity: 0.8;
}

/* 等级进度条样式 */
.body {
  padding: 30rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
}

.body progress {
  margin-top: 20rpx;
}

.box {
  height: 20rpx;
}

/* 底部菜单样式 */
.foot {
  background-color: #fff;
  padding: 20rpx 0;
}

.menu-list {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 25rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:active {
  background-color: #f9f9f9;
}

.menu-item image {
  width: 40rpx;
  height: 40rpx;
  margin-right: 20rpx;
}

.menu-item text {
  font-size: 30rpx;
  color: #333;
}

/* 最后一个菜单项特殊样式 */
.menu-item:last-child {
  color: #ff6b6b;
}

.menu-item:last-child text {
  color: #ff6b6b;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .header {
    padding: 40rpx 60rpx;
  }
  
  .body {
    padding: 40rpx 60rpx;
  }
  
  .menu-item {
    padding: 30rpx 60rpx;
  }
}

</style>