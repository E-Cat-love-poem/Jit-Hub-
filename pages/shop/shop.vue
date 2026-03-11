<template>
  <view class="order-container">
    <!-- 自定义tabs -->
    <view class="tabs">
      <view class="tab-bar">
        <view 
          class="tab-bar-item" 
          :class="{ active: activeTab === 'all' }"
          @click="changeTab('all')"
        >
          全部订单
        </view>
        <view 
          class="tab-bar-item" 
          :class="{ active: activeTab === 'unpaid' }"
          @click="changeTab('unpaid')"
        >
          待付款
        </view>
        <view 
          class="tab-bar-item" 
          :class="{ active: activeTab === 'paid' }"
          @click="changeTab('paid')"
        >
          已付款
        </view>
      </view>
      
      <!-- 全部订单 -->
      <view v-if="activeTab === 'all'" class="tab-content">
        <scroll-view scroll-y class="scroll-view">
          <view 
            v-for="item in orderList.all" 
            :key="item.id" 
            class="order-item"
          >
            <view class="order-header">
              <text>订单号：{{ item.id }}</text>
              <text class="order-time">{{ item.createTime }}</text>
            </view>
            
            <view class="order-body">
              <text class="product-name">{{ item.productName }}</text>
              <text class="product-price">¥{{ item.price }}</text>
            </view>
            
            <view class="order-footer">
              <text :class="['status', item.status === 0 ? 'unpaid' : 'paid']">
                {{ item.status === 0 ? '待付款' : '已付款' }}
              </text>
              <button 
                v-if="item.status === 0"
                type="primary" 
                size="mini" 
                @click="handlePay(item.id)"
              >
                支付
              </button>
            </view>
          </view>
          
          <view v-if="loading" class="loading">加载中...</view>
          <view v-if="!loading && orderList.all.length === 0" class="empty">
            暂无订单
          </view>
        </scroll-view>
      </view>
      
      <!-- 待付款订单 -->
      <view v-if="activeTab === 'unpaid'" class="tab-content">
        <scroll-view scroll-y class="scroll-view">
          <view 
            v-for="item in orderList.unpaid" 
            :key="item.id" 
            class="order-item"
          >
            <view class="order-body">
              <text class="product-name">{{ item.productName }}</text>
              <text class="product-price">¥{{ item.price }}</text>
            </view>
            <view class="order-footer">
              <button 
                type="primary" 
                size="mini" 
                @click="handlePay(item.id)"
              >
                去支付
              </button>
            </view>
          </view>
          
          <view v-if="loading" class="loading">加载中...</view>
          <view v-if="!loading && orderList.unpaid.length === 0" class="empty">
            暂无待付款订单
          </view>
        </scroll-view>
      </view>
      
      <!-- 已付款订单 -->
      <view v-if="activeTab === 'paid'" class="tab-content">
        <scroll-view scroll-y class="scroll-view">
          <view 
            v-for="item in orderList.paid" 
            :key="item.id" 
            class="order-item"
          >
            <view class="order-body">
              <text class="product-name">{{ item.productName }}</text>
              <text class="product-price">¥{{ item.price }}</text>
            </view>
            <view class="order-footer">
              <text class="pay-time">{{ item.payTime }}</text>
            </view>
          </view>
          
          <view v-if="loading" class="loading">加载中...</view>
          <view v-if="!loading && orderList.paid.length === 0" class="empty">
            暂无已付款订单
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { get, put } from '@/utils/request'

// 响应式数据
const activeTab = ref('all')
const loading = ref(false)
const orderList = ref({
  all: [],
  unpaid: [],
  paid: []
})

// 生命周期
onMounted(() => {
  refreshCurrentTab()
  loadInitialData()
})

// 初始化加载数据
const loadInitialData = async () => {
  try {
    loading.value = true
    await fetchAllOrders()
  } catch (error) {
    showError('初始化数据失败', error)
  } finally {
    loading.value = false
  }
}

// 刷新当前标签页
const refreshCurrentTab = async () => {
  try {
    loading.value = true
    
    if (activeTab.value === 'all') {
      await fetchAllOrders()
    }
  } catch (error) {
    showError('刷新数据失败', error)
  } finally {
    loading.value = false
  }
}

// 切换标签页
const changeTab = async (tabName) => {
  activeTab.value = tabName
  await refreshCurrentTab()
}

// 支付订单
const handlePay = async (orderId) => {
  try {
    loading.value = true
    
    console.log('支付订单:', orderId)
    
    // 1. 支付操作
    const res = await put(`/order/${orderId}/pay`, {})
    console.log('支付响应:', res)
    
    if (!res.success) {
      throw new Error(res.message || '支付失败')
    }
    
    // 2. 显示成功提示
    uni.showToast({ 
      title: '支付成功', 
      icon: 'success' 
    })
    
    // 3. 更新本地数据 - 使用 orderList 而不是 allOrders
    // 在全部订单中更新状态
    const index = orderList.value.all.findIndex(item => item.id == orderId)
    if (index !== -1) {
      orderList.value.all[index].status = 1
      orderList.value.all[index].updateTime = new Date().toISOString()
    }
    
    // 如果订单在待付款列表中，需要从该列表中移除
    orderList.value.unpaid = orderList.value.unpaid.filter(item => item.id != orderId)
    
    // 添加到已付款列表
    const paidOrder = orderList.value.all.find(item => item.id == orderId)
    if (paidOrder && !orderList.value.paid.find(item => item.id == orderId)) {
      orderList.value.paid.push(paidOrder)
	  await refreshCurrentTab()
    }
    
  } catch (error) {
    console.error('支付失败:', error)
    uni.showToast({ 
      title: error.message || '支付失败', 
      icon: 'none' 
    })
  } finally {
    loading.value = false
  }
}

// ---------- 网络请求方法 ----------
const fetchAllOrders = async () => {
  try {
    const res = await get('/order/all')
    if (res.success && res.data) {
      // 保存所有订单
      orderList.value.all = res.data
      // 前端过滤待付款订单
      orderList.value.unpaid = res.data.filter(item => item.status === 0)
      // 前端过滤已付款订单
      orderList.value.paid = res.data.filter(item => item.status === 1)
    }
  } catch (error) {
    console.error('获取订单失败:', error)
  }
}


// ---------- 工具方法 ----------
const showError = (defaultMsg, error) => {
  console.error(error)
  uni.showToast({
    title: error?.message || defaultMsg,
    icon: 'none'
  })
}

// 暴露给模板使用
defineExpose({
  activeTab,
  loading,
  orderList,
  changeTab,
  handlePay,
  refreshCurrentTab
})
</script>

<style scoped>
.order-container {
  padding: 20rpx;
  background-color: #f8f1e9;
}

/* Tabs样式 */
.tabs {
  width: 100%;
}

.tab-bar {
  display: flex;
  height: 80rpx;
  background-color: #f8f1e9;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
}

.tab-bar-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #666;
  position: relative;
}

.tab-bar-item.active {
  color: #409EFF;
  font-weight: bold;
}

.tab-bar-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 4rpx;
  background-color: #409EFF;
  border-radius: 2rpx;
}

.tab-content {
  flex: 1;
}

.scroll-view {
  height: calc(100vh - 120rpx);
}

/* 订单项样式 */
.order-item {
  margin: 20rpx 0;
  padding: 20rpx;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 12rpx 0 rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15rpx;
  font-size: 26rpx;
  color: #666;
}

.order-body {
  display: flex;
  justify-content: space-between;
  margin: 15rpx 0;
}

.product-name {
  font-size: 30rpx;
  font-weight: bold;
}

.product-price {
  font-size: 30rpx;
  color: #f56c6c;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status {
  padding: 8rpx 16rpx;
  border-radius: 4rpx;
  font-size: 24rpx;
}

.status.unpaid {
  color: #e6a23c;
  background-color: #fdf6ec;
}

.status.paid {
  color: #67c23a;
  background-color: #f0f9eb;
}

.pay-time {
  font-size: 24rpx;
  color: #999;
}

.loading, .empty {
  text-align: center;
  padding: 40rpx;
  font-size: 28rpx;
  color: #999;
}

/* 按钮样式 */
button {
  margin: 0;
  font-size: 24rpx;
  line-height: 1.5;
}

button[type="primary"] {
  background-color: #409EFF;
  color: white;
  border: none;
}

</style>