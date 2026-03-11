<template>
  <view class="register-container">
    <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
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
  background-color: #f8f9fa;
}

.logo {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 40rpx;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  margin-bottom: 60rpx;
  color: #333;
  text-align: center;
}

.form-group {
  width: 100%;
  max-width: 500rpx;
  margin-bottom: 40rpx;
}

.input {
  width: 100%;
  height: 80rpx;
  padding: 0 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
  background: #fff;
  outline: none;
  transition: border-color 0.3s;
}

.input:focus {
  border-color: #07C160;
}

.register-btn {
  width: 100%;
  max-width: 500rpx;
  height: 88rpx;
  line-height: 88rpx;
  background-color: #07C160;
  color: white;
  font-size: 32rpx;
  border-radius: 44rpx;
  margin-top: 40rpx;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.register-btn:hover:not(:disabled) {
  background-color: #06ad56;
}

.register-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.footer {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 60rpx;
  font-size: 26rpx;
}

.link {
  color: #576B95;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s;
}

.link:hover {
  color: #07C160;
  text-decoration: underline;
}
</style>