<!-- purchased.vue -->
<template>
  <view class="purchased-container">
    <!-- 页面标题 -->
    <view class="section-title">
      <text>我的已购课程</text>
    </view>

    <!-- 和Home一模一样的商品网格 -->
    <scroll-view scroll-y class="scroll-view">
      <view 
        class="crafts-grid"
        v-if="!loading && purchasedList.length > 0"
      >
        <view 
          class="craft-item" 
          v-for="item in purchasedList" 
          :key="item.id"
        >
          <image :src="item.imageUrl" mode="aspectFill"></image>
          <view class="craft-info">
            <text class="craft-name">{{ item.name }}</text>
            <text class="craft-origin">已购买 · {{ item.teacherName }}</text>
            <text class="craft-desc">{{ item.shortDesc }}</text>
            
            <!-- 进度条 -->
            <view class="progress-container">
              <view class="progress-text" :class="{ 'completed': item.progress === 100 }">
                学习进度：{{ item.progress }}%
                <text v-if="item.progress === 100" class="complete-badge">✓</text>
              </view>
              <view class="progress-bar">
                <view 
                  class="progress-inner" 
                  :style="{ 
                    width: item.progress + '%',
                    background: item.progress === 100 ? '#67C23A' : 'linear-gradient(90deg, #409EFF, #66b1ff)'
                  }"
                ></view>
              </view>
            </view>
            
            <view class="bottom-section">
              <text class="craft-price">¥{{ item.price }}</text>
              <button 
                class="study-btn" 
                :class="{ 'completed': item.progress === 100 }"
                @click="startLearning(item)"
                :disabled="item.progress === 100"
              >
                {{ item.progress === 100 ? '已完成' : '立即学习' }}
              </button>
            </view>
          </view>
        </view>
      </view>

      <view v-if="loading" class="loading">加载中...</view>
      <view v-if="!loading && purchasedList.length === 0" class="empty">
        暂无已购买的商品
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { get } from '@/utils/request'

const purchasedList = ref([])
const loading = ref(false)

// 课程进度映射（初始值）
const courseProgressMap = {
  'Java': 45,
  'Python': 30,
  '其他': 0
}

// 课程与教师名字映射
const courseTeacherNameMap = {
  'Java': 'B站——一只宕机了的猫',
  'Python': 'Jit-Hub——韩霜'
}

// 存储每个课程的进度（用于持久化）- 按课程名存储
const courseProgressStorage = ref({})

onMounted(() => {
  // 从本地存储加载进度
  loadProgressFromStorage()
  loadPurchasedProducts()
})

// 从本地存储加载进度
const loadProgressFromStorage = () => {
  try {
    const savedProgress = uni.getStorageSync('courseProgress')
    if (savedProgress) {
      courseProgressStorage.value = savedProgress
      console.log('已加载的课程进度:', savedProgress)
    }
  } catch (e) {
    console.log('加载进度失败:', e)
  }
}

// 保存进度到本地存储
const saveProgressToStorage = () => {
  try {
    uni.setStorageSync('courseProgress', courseProgressStorage.value)
    console.log('已保存课程进度:', courseProgressStorage.value)
  } catch (e) {
    console.log('保存进度失败:', e)
  }
}

// 获取课程进度（相同课程共享）
const getCourseProgress = (courseName) => {
  if (!courseName) return 0
  
  // 检查本地存储中是否有该课程的进度
  if (courseProgressStorage.value[courseName] !== undefined) {
    return courseProgressStorage.value[courseName]
  }
  
  // 如果没有保存的进度，使用初始值
  if (courseName.includes('Java')) {
    return courseProgressMap['Java']
  } else if (courseName.includes('Python')) {
    return courseProgressMap['Python']
  } else {
    return courseProgressMap['其他']
  }
}

// 更新课程进度（相同课程共享）
const updateCourseProgress = (courseName, progress) => {
  if (!courseName) return
  
  // 更新所有相同课程的进度
  courseProgressStorage.value[courseName] = progress
  
  // 同时更新页面中所有相同课程的显示
  purchasedList.value.forEach((item, index) => {
    if (item.productName === courseName) {
      purchasedList.value[index].progress = progress
    }
  })
  
  // 保存到本地存储
  saveProgressToStorage()
}

const loadPurchasedProducts = async () => {
  loading.value = true
  try {
    const ordersRes = await get('/order/all')
    
    if (ordersRes.success && ordersRes.data) {
      const orders = ordersRes.data.filter(item => item.status === 1)
      
      // 获取所有商品数据
      const productsRes = await get('/product/featured')
      
      const productsMap = {}
      productsRes.forEach(product => {
        productsMap[product.name] = product
      })
      
      const courseCount = {}
      orders.forEach(order => {
        const courseName = order.productName
        if (courseName) {
          courseCount[courseName] = (courseCount[courseName] || 0) + 1
        }
      })
      
      purchasedList.value = orders.map(order => {
        let productInfo = null
        if (order.productName && productsMap[order.productName]) {
          productInfo = productsMap[order.productName]
        }
        
        let imageUrl = '/static/images/default-product.png'
        if (productInfo && productInfo.imageUrl) {
          let rawImageUrl = productInfo.imageUrl
          
          if (rawImageUrl && !rawImageUrl.startsWith('http') && !rawImageUrl.startsWith('/')) {
            imageUrl = `/static/images/${rawImageUrl}`
          } else if (rawImageUrl.includes('localhost:8090') || rawImageUrl.includes('localhost')) {
            const filename = rawImageUrl.split('/').pop()
            imageUrl = `/static/images/${filename}`
          } else if (rawImageUrl) {
            imageUrl = rawImageUrl
          }
        }
        
        // 设置进度和教师 - 相同课程共享进度
        let progress = 0
        let teacherName = ''
        
        if (order.productName) {
          // 获取课程进度（相同课程共享）
          progress = getCourseProgress(order.productName)
          
          // 设置教师
          if (order.productName.includes('Java')) {
            teacherName = courseTeacherNameMap['Java']
          } else if (order.productName.includes('Python')) {
            teacherName = courseTeacherNameMap['Python']
          } else {
            teacherName = '资深教师'
          }
        }
        
        const buyCount = courseCount[order.productName] || 1
        
        return {
          id: order.id,
          name: order.productName || '未命名课程',
          imageUrl: imageUrl,
          origin: '已购买',
          category: productInfo ? (productInfo.categoryName || productInfo.category || '我的课程') : '我的课程',
          shortDesc: productInfo ? 
            (productInfo.description ? productInfo.description.substring(0, 30) + '...' : `已购买${buyCount}次`) : 
            `已购买${buyCount}次 · 点击查看详情`,
          price: order.price || 0,
          progress: progress,
          productName: order.productName,
          teacherName: teacherName
        }
      })
      
      console.log('已购买商品列表:', purchasedList.value)
    }
  } catch (err) {
    console.error('加载已购商品失败:', err)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

const startLearning = (item) => {
  console.log('开始学习:', item)
  
  // 显示学习提示
  uni.showModal({
    title: '开始学习',
    content: `确定开始学习《${item.name}》吗？\n学习后该课程所有记录进度将增加5%`,
    showCancel: true,
    cancelText: '取消',
    confirmText: '开始学习',
    success: (res) => {
      if (res.confirm) {
        // 更新进度
        increaseProgress(item)
      }
    }
  })
}

// 增加进度 - 相同课程共享
const increaseProgress = (item) => {
  const courseName = item.productName
  
  if (!courseName) return
  
  // 获取当前课程进度
  const currentProgress = getCourseProgress(courseName)
  
  // 如果已经是100%，不再增加
  if (currentProgress >= 100) return
  
  // 增加5%，但不能超过100%
  const newProgress = Math.min(currentProgress + 5, 100)
  
  // 更新课程进度（所有相同课程一起更新）
  updateCourseProgress(courseName, newProgress)
  
  // 显示进度增加提示
  uni.showToast({
    title: `学习完成！进度+5% (${newProgress}%)`,
    icon: 'success',
    duration: 2000
  })
  
  // 如果进度达到100%，显示完成提示
  if (newProgress === 100) {
    setTimeout(() => {
      uni.showModal({
        title: '🎉 恭喜！',
        content: `恭喜您已完成《${item.name}》课程的学习！`,
        showCancel: false,
        confirmText: '太棒了！'
      })
    }, 1500)
  }
  
  console.log(`课程 ${courseName} 进度更新: ${currentProgress}% -> ${newProgress}%`)
}
</script>

<style scoped>
.purchased-container {
  background-color: #f8f8f8;
  min-height: 100vh;
}

/* 和Home页面一样的section-title */
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  background: #f8f1e9;
  margin-bottom: 10px;
}

.scroll-view {
  height: calc(100vh - 60px);
  padding-bottom: 20px;
}

/* 和Home页面一模一样的crafts-grid */
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
  display: flex;
  flex-direction: column;
}

.craft-name {
  font-size: 14px;
  font-weight: bold;
  display: block;
  margin-bottom: 4px;
  color: #333;
  line-height: 1.3;
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
  margin-bottom: 10px;
}

/* 进度条样式 */
.progress-container {
  margin: 8px 0;
}

.progress-text {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  transition: color 0.3s;
}

/* 当进度100%时，进度文字显示为绿色 */
.progress-text.completed {
  color: #67C23A;
  font-weight: bold;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-inner {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease-in-out, background 0.3s ease;
}

/* 完成徽章 */
.complete-badge {
  display: inline-block;
  margin-left: 5px;
  color: #67C23A;
  font-weight: bold;
  font-size: 14px;
}

/* 底部区域 */
.bottom-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.craft-price {
  font-size: 14px;
  color: #e4393c;
  font-weight: bold;
}

/* 立即学习按钮 */
.study-btn {
  background: linear-gradient(135deg, #409EFF, #66b1ff);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 4px 12px;
  font-size: 12px;
  min-height: auto;
  line-height: 1.5;
  transition: all 0.3s;
}

/* 已完成按钮样式 */
.study-btn.completed {
  background: #C0C4CC !important;
  color: #FFFFFF !important;
  cursor: not-allowed;
  opacity: 0.8;
}

.study-btn:active:not(.completed) {
  opacity: 0.8;
  transform: scale(0.95);
}

.study-btn[disabled] {
  opacity: 1 !important;
  transform: none !important;
}

.loading, .empty {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 14px;
}

/* 响应式调整 */
@media (min-width: 768px) {
  .crafts-grid {
    justify-content: flex-start;
  }
  
  .craft-item {
    width: calc(33.333% - 10px);
  }
}
</style>