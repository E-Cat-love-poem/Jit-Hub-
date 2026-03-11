<template>
  <view class="home-container">
    <!-- 头部搜索和轮播 -->
    <view class="header">
      <view class="search-container">
        <input 
          class="search" 
          placeholder="您想了解关于哪方面的知识呢？" 
          @confirm="onSearch"
          @input="onInputChange"
          v-model="searchText"
        />
        <button @click="onSearch">搜索</button>
      </view>

      <!-- 搜索结果区域 -->
      <view v-if="showSearchResults" class="search-results">
        <view class="section-title">
          <text>搜索结果</text>
          <text class="close-results" @click="closeSearchResults">关闭</text>
        </view>
        <view class="crafts-grid">
          <view 
            class="craft-item" 
            v-for="item in searchResults" 
            :key="item.id"
            @click="onSearchItemTap(item.id)"
          >
            <image :src="item.imageUrl" mode="aspectFill"></image>
            <view class="craft-info">
              <text class="craft-name">{{ item.name }}</text>
              <text class="craft-origin">{{ item.origin }}</text>
              <text class="craft-price">¥{{ item.price }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 轮播图 -->
      <view class="swiper-wrap">
        <swiper indicator-dots autoplay interval="3000">
          <swiper-item v-for="(item, index) in banners" :key="index">
            <image :src="item" mode="aspectFill"></image>
          </swiper-item>
        </swiper>
      </view>
    </view>

    <!-- 功能导航区域 - 改为点击跳转 -->
    <view class="function-nav">
      <view class="nav-title">快速导航</view>
      <view class="nav-grid">
        <view class="nav-card" @click="goToPage('chat')">
          <image src="/static/images/chat.png" mode="aspectFill" class="nav-icon"></image>
          <text class="nav-text">聊天室</text>
          <text class="nav-desc">与老师同学实时交流</text>
        </view>
        
        <view class="nav-card" @click="goToPage('ai')">
          <image src="/static/images/Ai.png" mode="aspectFill" class="nav-icon"></image>
          <text class="nav-text">AI解答</text>
          <text class="nav-desc">智能问题解答</text>
        </view>
        
        <view class="nav-card" @click="goToPage('course')">
          <image src="/static/images/course.png" mode="aspectFill" class="nav-icon"></image>
          <text class="nav-text">我的课程</text>
          <text class="nav-desc">查看学习进度</text>
        </view>
        
        <view class="nav-card" @click="goToPage('exam')">
          <image src="/static/images/exam.png" mode="aspectFill" class="nav-icon"></image>
          <text class="nav-text">在线测试</text>
          <text class="nav-desc">检验学习成果</text>
        </view>
      </view>
    </view>

    <!-- 主体内容 -->
    <view class="body">
      <view class="section-title">
        <text>精选学习资料</text>
        <view class="more" @click="goToAllProducts">查看更多 ></view>
      </view>
      
      <view class="crafts-grid">
        <view 
          class="craft-item" 
          v-for="item in featuredCrafts" 
          :key="item.id"
          @click="goToDetail(item.id)"
        >
          <image :src="item.imageUrl" mode="aspectFill"></image>
          <view class="craft-info">
            <text class="craft-name">{{ item.name }}</text>
            <text class="craft-origin">{{ item.origin }} · {{ item.category }}</text>
            <text class="craft-desc">{{ item.shortDesc }}</text>
            <text class="craft-price">¥{{ item.price }}</text>
          </view>
        </view>
      </view>
      
      <view class="section-title">
        <text>知名教师</text>
        <view class="more" @click="goToAllTeachers">查看全部 ></view>
      </view>
      
      <view class="masters-list">
        <view 
          class="master-card" 
          v-for="item in masters" 
          :key="item.id"
          @click="goToMasterDetail(item.id)"
        >
          <image :src="item.avatar" mode="aspectFill"></image>
          <view class="master-info">
            <text class="master-name">{{ item.name }}</text>
            <text class="master-skill">{{ item.skill }}</text>
            <text class="master-desc">{{ item.title }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 页脚 -->
    <view class="foot">
      <text>知识改变命运 · 学习成就未来</text>
    </view>

    <!-- 加载提示 -->
    <view v-if="isLoading" class="loading-mask">
      <view class="loading-content">
        <text>加载中...</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import { get } from '@/utils/request.js'

// 响应式数据
const searchText = ref('')
const showSearchResults = ref(false)
const isLoading = ref(false)

// 轮播图数据
const banners = ref([
  '/static/images/banner1.png',
  '/static/images/banner2.png',
  '/static/images/banner3.png',
  '/static/images/banner4.png',
  '/static/images/banner5.png'
])

// 精选商品数据
const featuredCrafts = ref([])

// 搜索结果数据
const searchResults = ref([])

// 教师数据
const masters = ref([
  { 
    id: 1, 
    name: 'Jit-Hub——韩霜', 
    avatar: '/static/avatars/user-avatar.jpg', 
    skill: 'Python爬虫',
    title: 'Jit-Hub负责人'
  },
  { 
    id: 2, 
    name: 'Jit-Hub——弗罗斯特', 
    avatar: '/static/avatars/avatar1.png', 
    skill: '英语教学',
    title: '英文趣味教学者'
  },
  { 
    id: 3, 
    name: 'B站——一只宕机了的猫', 
    avatar: '/static/avatars/avatar2.png', 
    skill: 'Java后端攻略',
    title: '一只了解前后段代码的猫'
  }
])

// 页面加载
onMounted(() => {
  loadFeaturedProducts()
})
onLoad(() => {
  console.log('Home页面加载')
  loadFeaturedProducts()
})
onShow(() => {
  console.log('Home页面显示，刷新数据')
  loadFeaturedProducts()
})

// 加载特色商品
const loadFeaturedProducts = async () => {
  isLoading.value = true
  try {
    const res = await get('/product/featured')
    
    featuredCrafts.value = res.map(item => {
      // 处理图片URL
      let imageUrl = item.imageUrl || ''
      
      // 1. 处理相对路径，如"logo.png"、"java.png"
      if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
        // 假设所有图片都在static/images目录下
        imageUrl = `/static/images/${imageUrl}`
      }
      
      // 2. 处理本地服务器路径
      else if (imageUrl.includes('localhost:8090') || imageUrl.includes('localhost')) {
        const filename = imageUrl.split('/').pop()
        imageUrl = `/static/images/${filename}`
      }
      
      // 3. 处理空值或无效值
      if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined') {
        imageUrl = '/static/images/default-product.png'
      }
      
      return {
        id: item.id,
        name: item.name,
        imageUrl: imageUrl,
        origin: item.origin,
        category: item.categoryName || item.category,
        shortDesc: item.description ? item.description.substring(0, 30) + '...' : '点击了解更多',
        price: item.price || 0,
        detailDesc: item.detailDesc || ''
      }
    })
  } catch (err) {
    console.error('加载特色商品失败:', err)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    isLoading.value = false
  }
}

// 输入框变化
const onInputChange = (e) => {
  searchText.value = e.detail ? e.detail.value : e.target.value
}

// 搜索功能
// 搜索功能
const onSearch = async () => {
  if (!searchText.value.trim()) {
    uni.showToast({ 
      title: '请输入搜索内容', 
      icon: 'none' 
    })
    return
  }

  isLoading.value = true
  
  try {
    const products = await get('/product/search', { 
      keyword: searchText.value 
    })
    console.log('搜索结果:', products)
    
    // 使用和特色商品相同的图片处理逻辑
    searchResults.value = products.map(item => {
      // 处理图片URL
      let imageUrl = item.imageUrl || ''
      
      // 1. 处理相对路径，如"logo.png"、"java.png"
      if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
        // 假设所有图片都在static/images目录下
        imageUrl = `/static/images/${imageUrl}`
      }
      
      // 2. 处理本地服务器路径
      else if (imageUrl.includes('localhost:8090') || imageUrl.includes('localhost')) {
        const filename = imageUrl.split('/').pop()
        imageUrl = `/static/images/${filename}`
      }
      
      // 3. 处理空值或无效值
      if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined') {
        imageUrl = '/static/images/default-product.png'
      }
      
      return {
        id: item.id,
        name: item.name,
        imageUrl: imageUrl,  // 使用处理后的图片URL
        origin: item.origin,
        price: item.price
      }
    })
    
    showSearchResults.value = true
  } catch (err) {
    console.error('搜索失败:', err)
    uni.showToast({ 
      title: '搜索失败', 
      icon: 'none' 
    })
  } finally {
    isLoading.value = false
  }
}

// 关闭搜索结果
const closeSearchResults = () => {
  showSearchResults.value = false
  searchText.value = ''
}

// 跳转到不同功能页面
const goToPage = (pageType) => {
  switch(pageType) {
    case 'chat':
      // 跳转到聊天室页面
      uni.navigateTo({
        url: '/pages/chat/chat',
        fail: () => {
          showErrorModal('聊天室功能开发中')
        }
      })
      break
      
    case 'ai':
      // 跳转到AI解答页面
      uni.navigateTo({
        url: '/pages/ai/ai',
        fail: () => {
          showErrorModal('AI解答功能开发中')
        }
      })
      break
      
    case 'course':
      // 跳转到我的课程页面
      uni.navigateTo({
        url: '/pages/purchased/purchased',
        fail: () => {
          showErrorModal('课程管理功能开发中')
        }
      })
      break
      
    case 'exam':
      // 跳转到在线测试页面
      uni.navigateTo({
        url: '/pages/exam/exam',
        fail: () => {
          showErrorModal('在线测试功能开发中')
        }
      })
      break
      
    default:
      showErrorModal('该功能即将上线')
  }
}

// 跳转到商品详情
const goToDetail = (id) => {
  if (!id) {
    uni.showToast({ 
      title: '商品ID无效', 
      icon: 'none' 
    })
    return
  }
  
  uni.navigateTo({
    url: `/pages/detail/detail?id=${id}`
  })
}

// 跳转到所有商品页面
const goToAllProducts = () => {
  uni.navigateTo({
    url: '/pages/products/products',
    fail: () => {
      showErrorModal('商品列表功能开发中')
    }
  })
}

// 跳转到教师详情
const goToMasterDetail = (id) => {
  uni.navigateTo({
    url: `/pages/master/master?id=${id}`,
    fail: () => {
      showErrorModal('教师详情功能开发中')
    }
  })
}

// 跳转到所有教师页面
const goToAllTeachers = () => {
  uni.navigateTo({
    url: '/pages/teachers/teachers',
    fail: () => {
      showErrorModal('教师列表功能开发中')
    }
  })
}

// 搜索结果项点击
const onSearchItemTap = (id) => {
  if (!id) {
    uni.showToast({ 
      title: '商品ID无效', 
      icon: 'none' 
    })
    return
  }

  uni.navigateTo({
    url: `/pages/detail/detail?id=${id}`
  })
}

// 错误提示弹窗
const showErrorModal = (message = '功能正在开发中，敬请期待') => {
  uni.showModal({
    title: '提示',
    content: message,
    showCancel: false,
    confirmText: '我知道了',
    success: (res) => {
      if (res.confirm) {
        console.log('用户点击了我知道了')
      }
    }
  })
}
</script>

<style scoped>
.home-container {
  background-color: #f8f8f8;
  min-height: 100vh;
  box-sizing: border-box;
}

/* 头部样式 */
.header {
  padding: 15px;
  background: #f8f1e7;
}

.search-container {
  display: flex;
  padding: 10px;
  align-items: center;
  gap: 10px;
}

.search {
  background: #fff;
  border-radius: 20px;
  padding: 10px 15px;
  font-size: 14px;
  flex: 1;
  border: 1px solid #e0e0e0;
}

.search-container button {
  background-color: #d4a762;
  color: white;
  border-radius: 20px;
  font-size: 14px;
  padding: 0;
  width: 100px;
  height: 36px;
  line-height: 36px;
  flex-shrink: 0;
  border: none;
  outline: none;
}

/* 搜索结果区域 */
.search-results {
  background: white;
  border-radius: 8px;
  margin-top: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.close-results {
  color: #999;
  font-size: 12px;
  cursor: pointer;
}

/* 轮播图 */
.swiper-wrap {
  margin-top: 20px;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
}

.swiper-wrap image {
  width: 100%;
  height: 100%;
}

/* 功能导航区域 */
.function-nav {
  padding: 15px;
  background: white;
  margin-bottom: 10px;
}

.nav-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.nav-card {
  background: #f8f1e9;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.nav-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  border-color: #d4a762;
}

.nav-card:active {
  transform: translateY(-2px);
}

.nav-icon {
  width: 50px;
  height: 50px;
  margin: 0 auto 10px;
  display: block;
}

.nav-text {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 5px;
}

.nav-desc {
  font-size: 12px;
  color: #888;
  display: block;
}

/* 主体内容 */
.body {
  padding-bottom: 50px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  background: #f8f1e9;
  margin: 10px 0;
}

.more {
  font-size: 12px;
  color: #999;
  font-weight: normal;
  cursor: pointer;
  transition: color 0.3s;
}

.more:active {
  color: #d4a762;
}

/* 商品网格 */
.crafts-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px;
  gap: 10px;
  justify-content: space-between;
}

.craft-item {
  width: calc(50% - 5px);
  background: #f8f1e9;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.3s;
}

.craft-item:active {
  transform: translateY(-2px);
}

.craft-item image {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.craft-info {
  padding: 10px;
}

.craft-name {
  font-size: 14px;
  font-weight: bold;
  display: block;
  margin-bottom: 4px;
  color: #333;
}

.craft-origin {
  font-size: 12px;
  color: #888;
  display: block;
  margin-bottom: 4px;
}

.craft-desc {
  font-size: 12px;
  color: #666;
  display: block;
  line-height: 1.4;
  margin-bottom: 6px;
}

.craft-price {
  font-size: 14px;
  color: #e4393c;
  font-weight: bold;
  display: block;
}

/* 教师列表 */
.masters-list {
  padding: 0 15px;
}

.master-card {
  display: flex;
  background: #f8f1e9;
  border-radius: 8px;
  margin-bottom: 15px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.3s;
}

.master-card:active {
  transform: translateX(5px);
}

.master-card image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  flex-shrink: 0;
}

.master-info {
  flex: 1;
  padding: 10px;
}

.master-name {
  font-size: 15px;
  font-weight: bold;
  display: block;
  margin-bottom: 4px;
  color: #333;
}

.master-skill {
  font-size: 13px;
  color: #d4a762;
  display: block;
  margin-bottom: 4px;
}

.master-desc {
  font-size: 12px;
  color: #666;
  display: block;
  line-height: 1.4;
}

/* 页脚 */
.foot {
  text-align: center;
  padding: 20px 0;
  color: #999;
  font-size: 12px;
  background: white;
  border-top: 1px solid #f8f1e9;
}

/* 加载蒙层 */
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  background: white;
  padding: 20px 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  font-size: 14px;
  color: #333;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .crafts-grid {
    justify-content: flex-start;
  }
  
  .craft-item {
    width: calc(33.333% - 10px);
  }
  
  .swiper-wrap {
    height: 300px;
  }
  
  .nav-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>