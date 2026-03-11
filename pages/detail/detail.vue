<template>
  <view class="detail-page">
    <!-- 加载状态 -->
    <view v-if="isLoading" class="loading">
      <image src="/static/logo.png" mode="aspectFit"></image>
    </view>

    <!-- 正常显示内容 -->
    <view v-else>
      <!-- 顶层：商品主图 -->
      <view class="top-section">
        <image :src="product.imageUrl" mode="widthFix" class="main-image"></image>
      </view>

      <!-- 中层：文化描述 -->
      <view class="middle-section">
        <!-- 基础信息 -->
        <view class="info-card">
          <text class="product-name">{{ product.name }}</text>
          <text class="product-origin">{{ product.origin }} · {{ product.categoryName }}</text>
          <text class="price">¥{{ product.price || '知识无价' }}</text>
        </view>

        <!-- 文化故事 -->
        <view class="culture-card">
          <view class="section-title">
            <image :src="product.imageUrl" class="title-icon"></image>
            <text>简单了解</text>
          </view>
          <text class="culture-desc">{{ product.detail_desc }}</text>
        </view>

        <!-- 制作工艺 -->
        <view class="craft-card">
          <view class="section-title">
            <image :src="product.imageUrl" class="title-icon"></image>
            <text>详细讲解</text>
          </view>
          <!-- 注意：uni-app中rich-text的使用方式 -->
          <rich-text :nodes="product.short_desc" class="craft-content"></rich-text>
        </view>
      </view>

      <!-- 底层：操作按钮 -->
      <view class="bottom-section">
        <button class="btn buy" @click="createOrder">购买此课程</button>
      </view>
    </view>
  </view>
</template>

<script>
import { ref, onMounted } from 'vue'
import { get, post } from '@/utils/request'
import { onLoad } from '@dcloudio/uni-app'

export default {
  setup() {
    const product = ref({})
    const isLoading = ref(true)
    const productId = ref('')
    
    // 时间格式化函数
    const formatTime = (timeString) => {
      if (!timeString) return '未知时间'
      
      try {
        const date = new Date(timeString)
        // 转换为本地时间（去掉时区影响）
        const localDate = new Date(date.getTime() + 8 * 60 * 60 * 1000) // 假设是东八区
        
        const year = localDate.getUTCFullYear()
        const month = (localDate.getUTCMonth() + 1).toString().padStart(2, '0')
        const day = localDate.getUTCDate().toString().padStart(2, '0')
        const hours = localDate.getUTCHours().toString().padStart(2, '0')
        const minutes = localDate.getUTCMinutes().toString().padStart(2, '0')
        const seconds = localDate.getUTCSeconds().toString().padStart(2, '0')
        
        // 格式：2025-12-17 21:56:01
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      } catch (e) {
        console.error('时间格式化错误:', e)
        return timeString
      }
    }
    
    // 页面加载
    onLoad((options) => {
      if (!options.id) {
        uni.showToast({ 
          title: '商品不存在', 
          icon: 'none' 
        })
        setTimeout(() => uni.navigateBack(), 1500)
        return
      }
      
      productId.value = options.id
      loadProductDetail()
    })
    
    // 加载商品详情
   // 在 loadProductDetail 函数中修改图片处理部分
   const loadProductDetail = async () => {
     isLoading.value = true
     
     try {
       const res = await get(`/product/detail/${productId.value}`)
       
       // 处理图片URL - 增加相对路径处理
       let imageUrl = res.imageUrl || ''
       
       // 1. 处理相对路径，如 "logo.png"
       if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
         // 假设所有图片都在 static/images 目录下
         imageUrl = `/static/images/${imageUrl}`
       }
       // 2. 处理本地服务器路径
       else if (imageUrl.includes('localhost:8090') || imageUrl.includes('localhost')) {
         const filename = imageUrl.split('/').pop()
         imageUrl = `/static/images/${filename}`
       }
       // 3. 处理空值或无效值
       else if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined') {
         imageUrl = '/static/images/default-product.png'
       }
       
       product.value = {
         id: res.id,
         name: res.name,
         imageUrl: imageUrl,  // 使用处理后的URL
         price: res.price,
         origin: res.origin || '未知',
         categoryName: res.categoryName || '未知',
         detail_desc: res.detailDesc || '暂无信息',
         short_desc: res.shortDesc || '<p>暂无信息</p>'
       }
       
       // uni-app中rich-text需要特定格式
       if (res.shortDesc && !res.shortDesc.startsWith('<')) {
         product.value.short_desc = `<div>${res.shortDesc}</div>`
       }
       
     } catch (err) {
       console.error('加载商品详情失败:', err)
       uni.showToast({ 
         title: '加载失败，请重试', 
         icon: 'none' 
       })
     } finally {
       isLoading.value = false
     }
   }
    
    // 显示购买成功提示框
    const showSuccessModal = (orderData) => {
      uni.showModal({
        title: '🎉 购买成功',
        content: `订单创建成功！\n\n订单号：${orderData.id}\n商品：${orderData.productName}\n金额：¥${orderData.price}\n\n3秒后自动跳转到订单页面`,
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#e4393c',
        success: (res) => {
          if (res.confirm) {
            // 立即跳转
            uni.switchTab({
              url: '/pages/shop/shop',
              success: () => {
                // 跳转成功后显示轻提示
                setTimeout(() => {
                  uni.showToast({
                    title: '已跳转到订单页面',
                    icon: 'success',
                    duration: 1500
                  })
                }, 500)
              }
            })
          }
        }
      })
      
      // 如果用户不操作，3秒后自动跳转
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/shop/shop'
        })
      }, 3000)
    }
    
    // 创建订单
    const createOrder = async () => {
      if (!product.value || !product.value.id) return
      
      uni.showLoading({ 
        title: '创建订单中...', 
        mask: true 
      })
      
      try {
        const result = await post('/order/create', {
          product_id: product.value.id,
          product_name: product.value.name,
          price: Math.round(product.value.price) // 转为分
        })
        
        uni.hideLoading()
        
        if (result.success) {
          // 显示成功提示框
          showSuccessModal(result.data || {
            id: '未知',
            productName: product.value.name,
            price: product.value.price
          })
        } else {
          uni.showToast({ 
            title: result.message || '创建订单失败', 
            icon: 'none' 
          })
        }
        
      } catch (error) {
        console.error('创建订单失败:', error)
        uni.hideLoading()
        uni.showToast({ 
          title: error.data?.message || '创建订单失败', 
          icon: 'none' 
        })
      }
    }
    
    return {
      product,
      isLoading,
      createOrder,
      formatTime  // 导出时间格式化函数
    }
  }
}
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #f8f1e7;
  padding-bottom: 100rpx;
}

/* 顶层样式 */
.top-section {
  background: #f8f1e7;
}
.main-image {
  width: 100%;
  display: block;
  border-bottom: 1rpx solid #e8d8b5;
}

/* 中层样式 */
.middle-section {
  padding: 20rpx 30rpx 120rpx;
}

/* 信息卡片 */
.info-card {
  background: #fff9f0;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  border: 1rpx solid #e8d8b5;
}
.product-name {
  font-size: 38rpx;
  font-weight: bold;
  color: #5a3921;
  display: block;
}
.product-origin {
  font-size: 28rpx;
  color: #8c7b6b;
  margin: 10rpx 0;
  display: block;
}
.price {
  font-size: 42rpx;
  color: #c33b2b;
  font-weight: bold;
}

/* 文化卡片 */
.culture-card, .craft-card {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}
.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 25rpx;
  font-size: 32rpx;
  color: #5a3921;
  font-weight: bold;
}
.title-icon {
  width: 36rpx;
  height: 36rpx;
  margin-right: 15rpx;
}
.culture-desc {
  font-size: 28rpx;
  line-height: 1.8;
  color: #666;
  display: block;
}

/* 制作工艺内容 */
.craft-content {
  font-size: 28rpx;
  line-height: 1.6;
  color: #666;
}

/* 底部按钮 */
.bottom-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  display: flex;
  background: white;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.1);
  z-index: 100;
}
.btn {
  flex: 1;
  border-radius: 0;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: none;
  outline: none;
  cursor: pointer;
}
.btn:active {
  opacity: 0.9;
}
.buy {
  background: #e4393c;
  color: white;
  font-weight: bold;
}

/* 加载动画 */
.loading {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8f1e7;
}
.loading image {
  width: 120rpx;
  height: 120rpx;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .middle-section {
    padding: 40rpx 60rpx 140rpx;
    max-width: 750rpx;
    margin: 0 auto;
  }
  
  .info-card, 
  .culture-card, 
  .craft-card {
    padding: 40rpx;
  }
  
  .product-name {
    font-size: 42rpx;
  }
  
  .price {
    font-size: 48rpx;
  }
}
</style>