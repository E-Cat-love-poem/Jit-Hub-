<template>
  <view class="login-container">
    <image class="logo" src="/static/images/logo.png"></image>
    <view class="title">Jit-Hub学习平台</view>
    
    <form @submit="handleLogin">
      <view class="form-group">
        <input 
          name="user_name" 
          placeholder="请输入用户名/邮箱" 
          class="input" 
          type="text"
          v-model="formData.user_name"
        />
      </view>
      
      <view class="form-group">
        <input 
          name="password" 
          placeholder="请输入密码" 
          class="input" 
          password
          v-model="formData.password"
        />
      </view>
      
      <button form-type="submit" class="login-btn" :loading="loading">登录</button>
    </form>
    
    <view class="footer">
      <navigator url="/pages/Register/Register" class="link">没有账号？立即注册</navigator>
      <!-- 注意这里使用 @click 而不是 @tap -->
      <view class="link" @click="handleForgetPassword">忘记密码</view>
    </view>
  </view>
</template>

<script>
import { post } from '@/utils/request'

export default {
  data() {
    return {
      loading: false,
      formData: {
        user_name: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin(e) {
      try {
        this.loading = true
        
        // 获取表单数据
        const formValue = e.detail.value
        const loginData = {
          account: formValue.user_name,
          password: formValue.password
        }
        
        console.log('发送登录请求:', loginData)
        
        const res = await post('/user/login', loginData)
        
        console.log('登录响应:', res)
        
        if (res.success) {
          console.log("登录成功")
          console.log("用户ID:", res.userInfo?.user_id)
          
          uni.showToast({ 
            title: res.message || '登录成功',
            icon: 'success'
          })
          
          // 保存用户信息
          uni.setStorageSync('user_name', res.user_name || '')
          uni.setStorageSync('userInfo', {
            userId: res.userInfo?.user_id,
            userName: res.userInfo?.user_name,
            email: res.userInfo?.email
          })
          
          // 保存token
          if (res.token) {
            uni.setStorageSync('token', res.token)
          }
          
          setTimeout(() => {
            uni.switchTab({ 
              url: '/pages/Home/Home',
              success: () => {
                console.log('跳转到首页成功')
              },
              fail: (err) => {
                console.log('跳转失败:', err)
                // 如果跳转失败，尝试其他方式
                uni.navigateTo({
                  url: '/pages/Home/Home'
                })
              }
            })
          }, 1500)
        } else {
          uni.showToast({ 
            title: res.message || '登录失败', 
            icon: 'none' 
          })
        }
      } catch (err) {
        console.error('登录请求异常:', err)
        uni.showToast({ 
          title: '网络错误，请稍后重试', 
          icon: 'none' 
        })
      } finally {
        this.loading = false
      }
    },
    
    handleForgetPassword() {
      console.log('点击了忘记密码')
      uni.showModal({
        title: '提示',
        content: '更多功能正在开发中，敬请期待',
        showCancel: false,
        confirmText: '我知道了',
        success: (res) => {
          if (res.confirm) {
            console.log('用户点击了我知道了')
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 150rpx;
  height: 150rpx;
  margin-bottom: 30rpx;
}

.title {
  font-size: 36rpx;
  color: #d4a762;
  margin-bottom: 80rpx;
  font-weight: bold;
}

.form-group {
  width: 100%;
  margin-bottom: 40rpx;
}

.input {
  width: 100%;
  height: 80rpx;
  border-bottom: 1rpx solid #d4a762;
  padding: 10rpx 0;
  font-size: 28rpx;
  outline: none;
  background: transparent;
}

.login-btn {
  width: 100%;
  height: 90rpx;
  line-height: 90rpx;
  background-color: #d4a762;
  color: #fff;
  border-radius: 45rpx;
  margin-top: 60rpx;
  font-size: 32rpx;
  border: none;
}

.login-btn[disabled] {
  opacity: 0.6;
}

.footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 50rpx;
}

.link {
  color: #d4a762;
  font-size: 26rpx;
  cursor: pointer;
}

/* 添加点击效果 */
.link:active {
  color: #d4a762;
}
page {
  background-color: #f8f1e9 !important;
  min-height: 100vh;
}

.login-container {
  background-color: #f8f1e9;
  min-height: 100vh;
}
</style>