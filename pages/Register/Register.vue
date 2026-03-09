<template>
  <view class="register-container">
    <image class="logo" src="/static/images/logo.png" mode="aspectFit"></image>
    <view class="title">注册新账号</view>
    
    <form @submit="handleRegister">
      <view class="form-group">
        <input 
          v-model="formData.user_name"
          name="user_name" 
          placeholder="请输入用户名(4-16位字母或数字)" 
          class="input" 
          type="text"
        />
      </view>
      
      <view class="form-group">
        <input 
          v-model="formData.email"
          name="email" 
          placeholder="请输入邮箱" 
          class="input" 
          type="email"
        />
      </view>
      
      <view class="form-group">
        <input 
          v-model="formData.password"
          name="password" 
          placeholder="请输入密码(6-20位字符)" 
          class="input" 
          password
          type="text"
        />
      </view>
      
      <view class="form-group">
        <input 
          v-model="formData.confirmPassword"
          name="confirmPassword" 
          placeholder="请再次输入密码" 
          class="input" 
          password
          type="text"
        />
      </view>
      
      <button form-type="submit" class="register-btn" :loading="loading">注册</button>
    </form>
    
    <view class="footer">
      <navigator url="/pages/Login/Login" class="link">已有账号？去登录</navigator>
    </view>
  </view>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { post } from '@/utils/request'

export default {
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const formData = reactive({
      user_name: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    // 表单验证方法
    const validateForm = (user_name, email, password, confirmPassword) => {
      let isValid = true

      // 用户名验证 (4-16位字母或数字)
      if (!/^[a-zA-Z0-9]{4,16}$/.test(user_name)) {
        uni.showToast({
          title: '用户名需4-16位字母或数字',
          icon: 'none'
        })
        isValid = false
      }

      // 邮箱验证
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        uni.showToast({
          title: '请输入有效的邮箱地址',
          icon: 'none'
        })
        isValid = false
      }

      // 密码验证 (6-20位)
      if (password.length < 6 || password.length > 20) {
        uni.showToast({
          title: '密码需6-20位字符',
          icon: 'none'
        })
        isValid = false
      }

      // 确认密码一致性
      if (password !== confirmPassword) {
        uni.showToast({
          title: '两次密码输入不一致',
          icon: 'none'
        })
        isValid = false
      }

      return isValid
    }

    // 注册表单提交
    const handleRegister = async (e) => {
      // 获取表单数据
      let user_name, email, password, confirmPassword
      
      if (e && e.detail && e.detail.value) {
        // uni-app表单提交方式
        user_name = e.detail.value.user_name || formData.user_name
        email = e.detail.value.email || formData.email
        password = e.detail.value.password || formData.password
        confirmPassword = e.detail.value.confirmPassword || formData.confirmPassword
      } else {
        // 直接使用双向绑定的数据
        user_name = formData.user_name
        email = formData.email
        password = formData.password
        confirmPassword = formData.confirmPassword
      }

      // 1. 前端验证
      if (!validateForm(user_name, email, password, confirmPassword)) {
        return
      }

      loading.value = true

      try {
        // 2. 调用注册接口
        const res = await post('/user/register', {
          user_name,
          email,
          password
        })

        // 3. 处理响应
        if (res.success) {
          uni.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 1500,
            success: () => {
              // 延迟跳转让用户看到成功提示
              setTimeout(() => {
                // 返回登录页
                uni.navigateBack({
                  delta: 1,
                  success: () => {
                    console.log('返回登录页成功')
                  }
                })
              }, 1500)
            }
          })
        } else {
          uni.showToast({
            title: res.message || '注册失败',
            icon: 'none'
          })
        }
      } catch (err) {
        console.error('完整错误响应:', err)
        uni.showToast({
          title: err.data?.message || 
                (err.statusCode === 500 ? '服务器内部错误' : '注册失败，请检查输入'),
          icon: 'none',
          duration: 3000
        })
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      formData,
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-container {
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f1e9 0%, #f5ebe0 100%);
  position: relative;
}

/* 添加背景装饰元素 */
.register-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 400rpx;
  background: linear-gradient(135deg, rgba(200, 180, 160, 0.1) 0%, rgba(200, 180, 160, 0.05) 100%);
  border-radius: 0 0 40rpx 40rpx;
  z-index: 0;
}

.logo {
  width: 180rpx;
  height: 180rpx;
  margin-bottom: 30rpx;
  border-radius: 50%;
  background: white;
  padding: 20rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: translateY(-5rpx);
}

.title {
  font-size: 44rpx;
  font-weight: 700;
  margin-bottom: 60rpx;
  color: #5a4636;
  text-align: center;
  position: relative;
  z-index: 1;
  letter-spacing: 2rpx;
}

.title::after {
  content: '';
  position: absolute;
  bottom: -15rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 80rpx;
  height: 4rpx;
  background: linear-gradient(90deg, #d4b896 0%, #b89a7a 100%);
  border-radius: 2rpx;
}

form {
  width: 100%;
  max-width: 600rpx;
  position: relative;
  z-index: 1;
}

.form-group {
  width: 80%;
  margin-bottom: 50rpx;
  position: relative;
}

.input {
  width: 100%;
  height: 90rpx;
  padding: 0 30rpx;
  padding-left: 80rpx;
  border: 2rpx solid #e8ddd1;
  border-radius: 20rpx;
  font-size: 30rpx;
  background: rgba(255, 255, 255, 0.95);
  color: #5a4636;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.03);
}

.input::placeholder {
  color: #b8a99a;
  font-size: 28rpx;
}

.input:focus {
  border-color: #d4b896;
  box-shadow: 0 8rpx 25rpx rgba(212, 184, 150, 0.2);
  transform: translateY(-2rpx);
  background: white;
}

/* 添加输入框图标 */
.form-group::before {
  content: '';
  position: absolute;
  left: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 30rpx;
  height: 30rpx;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 2;
}

.form-group:nth-child(1)::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23d4b896'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E");
}

.form-group:nth-child(2)::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23d4b896'%3E%3Cpath d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'/%3E%3C/svg%3E");
}

.form-group:nth-child(3)::before,
.form-group:nth-child(4)::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23d4b896'%3E%3Cpath d='M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z'/%3E%3C/svg%3E");
}

.register-btn {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  background: linear-gradient(135deg, #d4b896 0%, #b89a7a 100%);
  color: white;
  font-size: 34rpx;
  font-weight: 600;
  border-radius: 25rpx;
  margin-top: 60rpx;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 10rpx 30rpx rgba(184, 154, 122, 0.3);
  letter-spacing: 2rpx;
}

.register-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
}

.register-btn:hover:not(:disabled) {
  transform: translateY(-3rpx);
  box-shadow: 0 15rpx 40rpx rgba(184, 154, 122, 0.4);
}

.register-btn:hover:not(:disabled)::before {
  left: 100%;
}

.register-btn:active:not(:disabled) {
  transform: translateY(-1rpx);
  box-shadow: 0 8rpx 25rpx rgba(184, 154, 122, 0.3);
}

.register-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading {
  display: inline-block;
  width: 20rpx;
  height: 20rpx;
  border: 2rpx solid white;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
  margin-right: 15rpx;
  vertical-align: middle;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.footer {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 80rpx;
  font-size: 28rpx;
  position: relative;
  z-index: 1;
}

.link {
  color: #b89a7a;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
  padding: 15rpx 30rpx;
  border-radius: 50rpx;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.7);
  border: 1rpx solid #e8ddd1;
}

.link:hover {
  color: #9c7d5e;
  background: white;
  text-decoration: none;
  box-shadow: 0 5rpx 20rpx rgba(184, 154, 122, 0.2);
  transform: translateY(-2rpx);
  border-color: #d4b896;
}

/* 响应式调整 */
@media (max-width: 750rpx) {
  .register-container {
    padding: 30rpx;
  }
  
  .input {
    height: 85rpx;
    font-size: 28rpx;
  }
  
  .register-btn {
    height: 90rpx;
    line-height: 90rpx;
  }
}

/* 添加淡入动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-group {
  animation: fadeInUp 0.5s ease forwards;
  animation-delay: calc(var(--group-index, 0) * 0.1s);
  opacity: 0;
}

.form-group:nth-child(1) { --group-index: 1; }
.form-group:nth-child(2) { --group-index: 2; }
.form-group:nth-child(3) { --group-index: 3; }
.form-group:nth-child(4) { --group-index: 4; }
</style>