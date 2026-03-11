<template>
  <view class="page">
    <!-- 居中的logo图片 -->
    <view class="logo-container">
      <image src="/static/images/logo.png" mode="aspectFit" class="logo"></image>
    </view>
    
    <!-- 上传课程区域 -->
    <view class="upload-section">
      <view class="section-title">或者您有更好的课程？请在此上传</view>
      
      <view class="upload-form">
        <view class="form-item">
          <text class="form-label">课程名称</text>
          <input 
            v-model="courseForm.name" 
            class="form-input" 
            placeholder="请输入课程名称" 
            placeholder-class="placeholder"
          />
        </view>
        
        <view class="form-item">
          <text class="form-label">产地/来源</text>
          <input 
            v-model="courseForm.origin" 
            class="form-input" 
            placeholder="请输入产地/来源" 
            placeholder-class="placeholder"
          />
        </view>
        
        <view class="form-item">
          <text class="form-label">分类ID</text>
          <input 
            v-model="courseForm.category_id" 
            class="form-input" 
            placeholder="请输入分类ID" 
            placeholder-class="placeholder"
            type="number"
          />
        </view>
        
        <view class="form-item">
          <text class="form-label">分类名称</text>
          <input 
            v-model="courseForm.category_name" 
            class="form-input" 
            placeholder="请输入分类名称" 
            placeholder-class="placeholder"
          />
        </view>
        
        <view class="form-item">
          <text class="form-label">价格</text>
          <input 
            v-model="courseForm.price" 
            class="form-input" 
            placeholder="请输入价格" 
            placeholder-class="placeholder"
            type="number"
          />
        </view>
        
        <view class="form-item">
          <text class="form-label">图片URL</text>
          <input 
            v-model="courseForm.image_url" 
            class="form-input" 
            placeholder="请输入图片URL链接" 
            placeholder-class="placeholder"
          />
        </view>
        
        <view class="form-item full-width">
          <text class="form-label">简短描述</text>
          <textarea 
            v-model="courseForm.short_desc" 
            class="form-textarea" 
            placeholder="请输入课程简短描述" 
            placeholder-class="placeholder"
            maxlength="100"
          />
          <view class="char-count">{{ courseForm.short_desc.length }}/100</view>
        </view>
        
        <view class="form-item full-width">
          <text class="form-label">详细描述</text>
          <textarea 
            v-model="courseForm.detail_desc" 
            class="form-textarea" 
            placeholder="请输入课程详细描述" 
            placeholder-class="placeholder"
            maxlength="500"
          />
          <view class="char-count">{{ courseForm.detail_desc.length }}/500</view>
        </view>
        
        <view class="form-item">
          <text class="form-label">状态</text>
          <view class="radio-group">
            <label class="radio-item" @tap="setStatus(1)">
              <view class="radio-icon">{{ courseForm.status === 1 ? '✓' : '○' }}</view>
              <text class="radio-text">上架</text>
            </label>
            <label class="radio-item" @tap="setStatus(0)">
              <view class="radio-icon">{{ courseForm.status === 0 ? '✓' : '○' }}</view>
              <text class="radio-text">下架</text>
            </label>
          </view>
        </view>
        
        <view class="form-buttons">
          <button class="btn btn-reset" @tap="resetForm">重置</button>
          <button class="btn btn-submit" @tap="submitCourse" :disabled="isSubmitting">
            {{ isSubmitting ? '提交中...' : '提交课程' }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      courseForm: {
        name: '',
        origin: '',
        category_id: '',
        category_name: '',
        image_url: '',
        short_desc: '',
        detail_desc: '',
        price: '',
        status: 1, // 默认上架
        create_time: '',
        update_time: ''
      },
      isSubmitting: false
    }
  },
  
  onLoad(options) {
    console.log('页面加载', options)
  },
  
  onShow() {
    console.log('页面显示')
  },
  
  methods: {
    // 设置课程状态
    setStatus(status) {
      this.courseForm.status = status
    },
    
    // 重置表单（有弹窗确认，用于手动点击重置按钮）
    resetForm() {
      uni.showModal({
        title: '确认重置',
        content: '确定要重置所有表单内容吗？',
        success: (res) => {
          if (res.confirm) {
            this.courseForm = {
              name: '',
              origin: '',
              category_id: '',
              category_name: '',
              image_url: '',
              short_desc: '',
              detail_desc: '',
              price: '',
              status: 1,
              create_time: '',
              update_time: ''
            }
            uni.showToast({
              title: '已重置',
              icon: 'success'
            })
          }
        }
      })
    },
    
    // 提交成功后清空表单（无弹窗）
    clearFormAfterSubmit() {
      this.courseForm = {
        name: '',
        origin: '',
        category_id: '',
        category_name: '',
        image_url: '',
        short_desc: '',
        detail_desc: '',
        price: '',
        status: 1,
        create_time: '',
        update_time: ''
      }
    },
    
    // 验证表单
    validateForm() {
      const requiredFields = [
        'name', 'origin', 'category_id', 'category_name', 'price', 'short_desc'
      ]
      
      for (const field of requiredFields) {
        if (!this.courseForm[field] || this.courseForm[field].toString().trim() === '') {
          uni.showToast({
            title: `请填写${this.getFieldName(field)}`,
            icon: 'none'
          })
          return false
        }
      }
      
      // 验证价格是否为有效数字
      if (isNaN(parseFloat(this.courseForm.price)) || parseFloat(this.courseForm.price) <= 0) {
        uni.showToast({
          title: '请输入有效的价格',
          icon: 'none'
        })
        return false
      }
      
      // 验证分类ID是否为有效数字
      if (isNaN(parseInt(this.courseForm.category_id))) {
        uni.showToast({
          title: '分类ID必须是数字',
          icon: 'none'
        })
        return false
      }
      
      return true
    },
    
    // 获取字段中文名称
    getFieldName(field) {
      const fieldNames = {
        name: '课程名称',
        origin: '产地/来源',
        category_id: '分类ID',
        category_name: '分类名称',
        price: '价格',
        short_desc: '简短描述'
      }
      return fieldNames[field] || field
    },
    
    // 提交课程
    async submitCourse() {
      if (!this.validateForm()) {
        return
      }
      
      this.isSubmitting = true
      
      try {
        // 添加时间戳
        const now = new Date().toISOString()
        
        // 使用驼峰命名法，与Java实体类字段名一致
        const formData = {
          name: this.courseForm.name,
          origin: this.courseForm.origin,
          categoryId: parseInt(this.courseForm.category_id),     // 注意：驼峰
          categoryName: this.courseForm.category_name,          // 注意：驼峰
          price: parseFloat(this.courseForm.price),
          imageUrl: this.courseForm.image_url,                  // 注意：驼峰
          shortDesc: this.courseForm.short_desc,                // 注意：驼峰
          detailDesc: this.courseForm.detail_desc,              // 注意：驼峰
          status: this.courseForm.status,
          createTime: now,                                      // 注意：驼峰
          updateTime: now                                       // 注意：驼峰
        }
        
        console.log('提交的数据（驼峰格式）:', formData)
        
        // 调用后端API上传课程
        const result = await uni.request({
          url: 'http://localhost:8088/product/add',
          method: 'POST',
          data: formData,
          header: {
            'Content-Type': 'application/json'
          }
        })
        
        console.log('提交课程响应:', result)
        
        if (result.statusCode === 200 && result.data === true) {
          uni.showToast({
            title: '课程上传成功！',
            icon: 'success',
            duration: 2000
          })
          
          // 清空表单（无弹窗）
          this.courseForm = {
            name: '',
            origin: '',
            category_id: '',
            category_name: '',
            image_url: '',
            short_desc: '',
            detail_desc: '',
            price: '',
            status: 1,
            create_time: '',
            update_time: ''
          }
        } else {
          throw new Error('上传失败')
        }
        
      } catch (error) {
        console.error('上传失败:', error)
        uni.showToast({
          title: '上传失败，请重试',
          icon: 'error'
        })
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
/* 页面样式 */
.page {
  box-sizing: border-box;
  padding: 40rpx 0;
  min-height: 100vh;
  background-color: #f8f1e7;
  display: flex;
  flex-direction: column;
}

/* 居中的logo容器 */
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40rpx 0;
  margin-bottom: 40rpx;
}

.logo {
  width: 300rpx;
  height: 300rpx;
  object-fit: contain;
  border-radius: 20rpx;
  box-shadow: 0 8rpx 30rpx rgba(90, 57, 33, 0.1);
}

/* 上传课程区域样式 */
.upload-section {
  background-color: rgba(90, 57, 33, 0.05);
  margin: 0 50rpx 40rpx;
  padding: 40rpx;
  border-radius: 20rpx;
  border: 2rpx solid rgba(90, 57, 33, 0.1);
  flex: 1;
}

.section-title {
  font-size: 42rpx;
  font-weight: bold;
  color: #5a3921;
  text-align: center;
  margin-bottom: 40rpx;
  padding-bottom: 20rpx;
  border-bottom: 3rpx solid #d4a762;
}

.upload-form {
  display: flex;
  flex-wrap: wrap;
  gap: 30rpx;
}

.form-item {
  width: calc(50% - 15rpx);
  margin-bottom: 20rpx;
}

.form-item.full-width {
  width: 100%;
}

.form-label {
  display: block;
  font-size: 32rpx;
  color: #5a3921;
  margin-bottom: 15rpx;
  font-weight: 500;
}

.form-input {
  width: 100%;
  height: 80rpx;
  padding: 0 25rpx;
  border: 2rpx solid #d4a762;
  border-radius: 10rpx;
  font-size: 28rpx;
  color: #333;
  background-color: white;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #5a3921;
  outline: none;
}

.form-textarea {
  width: 100%;
  height: 200rpx;
  padding: 25rpx;
  border: 2rpx solid #d4a762;
  border-radius: 10rpx;
  font-size: 28rpx;
  color: #333;
  background-color: white;
  box-sizing: border-box;
  resize: none;
}

.form-textarea:focus {
  border-color: #5a3921;
  outline: none;
}

.placeholder {
  color: #999;
  font-size: 28rpx;
}

.char-count {
  text-align: right;
  font-size: 26rpx;
  color: #999;
  margin-top: 10rpx;
}

.radio-group {
  display: flex;
  gap: 40rpx;
  margin-top: 10rpx;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 15rpx;
  padding: 15rpx;
  border-radius: 8rpx;
  transition: background-color 0.3s;
}

.radio-item:active {
  background-color: rgba(90, 57, 33, 0.1);
}

.radio-icon {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2rpx solid #d4a762;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #5a3921;
  font-weight: bold;
}

.radio-text {
  font-size: 28rpx;
  color: #333;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 40rpx;
  gap: 30rpx;
}

.btn {
  flex: 1;
  height: 90rpx;
  border: none;
  border-radius: 10rpx;
  font-size: 32rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.btn:active {
  transform: scale(0.98);
}

.btn-reset {
  background-color: rgba(212, 167, 98, 0.2);
  color: #5a3921;
  border: 2rpx solid #d4a762;
}

.btn-reset:active {
  background-color: rgba(212, 167, 98, 0.3);
}

.btn-submit {
  background-color: #5a3921;
  color: white;
}

.btn-submit:disabled {
  background-color: #999;
  opacity: 0.7;
}

.btn-submit:not(:disabled):active {
  background-color: #3a2919;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .upload-section {
    margin: 0 30rpx 30rpx;
    padding: 30rpx;
  }
  
  .logo-container {
    padding: 30rpx 0;
  }
  
  .logo {
    width: 250rpx;
    height: 250rpx;
  }
  
  .form-item {
    width: 100%;
  }
  
  .section-title {
    font-size: 38rpx;
  }
}

@media (min-width: 768px) {
  .upload-section {
    max-width: 800rpx;
    margin: 0 auto 40rpx;
  }
  
  .logo-container {
    padding: 60rpx 0;
  }
  
  .logo {
    width: 400rpx;
    height: 400rpx;
  }
}

/* 平板设备适配 */
@media (min-width: 481px) and (max-width: 767px) {
  .upload-section {
    margin: 0 40rpx 40rpx;
  }
  
  .logo {
    width: 350rpx;
    height: 350rpx;
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

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .page {
    background-color: #1a1a1a;
  }
  
  .logo {
    box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.3);
  }
  
  .upload-section {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .section-title {
    color: #e6e6e6;
  }
  
  .form-label {
    color: #e6e6e6;
  }
  
  .form-input,
  .form-textarea {
    background-color: #333;
    color: #e6e6e6;
    border-color: #666;
  }
  
  .form-input:focus,
  .form-textarea:focus {
    border-color: #d4a762;
  }
  
  .placeholder {
    color: #888;
  }
  
  .radio-text {
    color: #e6e6e6;
  }
  
  .radio-icon {
    border-color: #d4a762;
    color: #d4a762;
  }
  
  .btn-reset {
    background-color: rgba(212, 167, 98, 0.1);
    color: #d4a762;
    border-color: #d4a762;
  }
  
  .btn-submit {
    background-color: #d4a762;
    color: #1a1a1a;
  }
  
  .btn-submit:not(:disabled):active {
    background-color: #c39b52;
  }
}
</style>