<!-- purchased.vue -->
<template>
  <view class="purchased-container">
    <!-- 页面标题 -->
    <view class="section-title">
      <text>我要学习的课程</text>
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
            <text class="craft-origin">课程讲师为 · {{ item.teacherName }}</text>
            <text class="craft-desc">请认真学习吧，加油~</text>
            
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
        暂无已确认的课程
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
  'Java': 'B站——Rosy-迷迭香',
  'JavaScript': 'B站——Rosy-迷迭香',
  'Python': 'Jit-Hub——韩霜',
  '大学英语四六级考试': 'Jit-Hub——弗罗斯特'
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
      
      // 获取商品数据
      const productsRes = await get('/product/featured')
      
      const productsMap = {}
      productsRes.forEach(product => {
        productsMap[product.name] = product
      })
      
      console.log('课程映射:', productsMap)
      console.log('课程数据:', orders)
      
      purchasedList.value = orders.map(order => {
        // ✅ 关键修复1：确保字段名与数据库一致
        const courseName = order.product_name || order.productName || '未命名课程'
        
        const productInfo = productsMap[courseName] || null
        
        // ✅ 关键修复2：统一图片处理逻辑
        let imageUrl = '/static/images/default-product.png'
        if (productInfo?.imageUrl) {
          let rawImageUrl = productInfo.imageUrl
          if (!rawImageUrl.startsWith('http') && !rawImageUrl.startsWith('/')) {
            imageUrl = `/static/images/${rawImageUrl}`
          } else {
            imageUrl = rawImageUrl
          }
        }
        
        // ✅ 关键修复3：确保 productName 字段存在
        const progress = getCourseProgress(courseName)
        const teacherName = getTeacherName(courseName)
        
        return {
          id: order.id,
          name: courseName,  // 显示的名称
          imageUrl: imageUrl,
          origin: '已购买',
          category: '我的课程',
          shortDesc: `已购买 · 点击查看详情`,
          price: order.price || 0,
          progress: progress,
          productName: courseName,  // ✅ 用于进度更新的关键字段
          teacherName: teacherName
        }
      })
      
      console.log('最终列表:', purchasedList.value)
    }
  } catch (err) {
    console.error('加载失败:', err)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 新增：获取教师名
const getTeacherName = (courseName) => {
  if (courseName.includes('Java')) return 'B站——Rosy-迷迭香'
  if (courseName.includes('Python')) return 'Jit-Hub——韩霜'
  if (courseName.includes('大学英语四六级考试')) return 'Jit-Hub——弗罗斯特'
  return 'Jit-Hub——资深教师'
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
// 增加进度 - 相同课程共享
const increaseProgress = (item) => {
  const courseName = item.productName
  
  if (!courseName) {
    console.error('courseName 为空:', item)
    uni.showToast({ title: '课程信息错误', icon: 'none' })
    return
  }
  
  // 获取当前进度
  const currentProgress = getCourseProgress(courseName)
  
  // 如果已经是100%，不再增加
  if (currentProgress >= 100) {
    uni.showToast({ title: '课程已完成', icon: 'none' })
    return
  }
  
  // 增加5%
  const newProgress = Math.min(currentProgress + 5, 100)
  
  // ✅ 关键修复：更新所有相同课程的进度
  updateCourseProgress(courseName, newProgress)
  
  // ✅ 关键修复：立即更新视图
  purchasedList.value.forEach((order, index) => {
    if (order.productName === courseName) {
      purchasedList.value[index].progress = newProgress
    }
  })
  
  // 显示提示
  uni.showToast({
    title: `学习完成！进度+5% (${newProgress}%)`,
    icon: 'success'
  })
  
  // 100% 时显示恭喜
  if (newProgress === 100) {
    setTimeout(() => {
      uni.showModal({
        title: '🎉 恭喜！',
        content: `恭喜您已完成《${courseName}》课程的学习！`,
        showCancel: false
      })
    }, 1500)
  }
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