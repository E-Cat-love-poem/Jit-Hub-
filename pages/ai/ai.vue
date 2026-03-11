<template>
  <view class="chat-page">
    <!-- 顶部标题 -->
    <view class="chat-header">
      <text class="header-title">PRTS学习系统</text>
    </view>

    <!-- 聊天消息区域 -->
    <scroll-view 
      scroll-y 
      class="chat-messages" 
      :scroll-top="scrollTop"
      scroll-with-animation
      @scroll="onScroll"
      :style="{paddingBottom: inputAreaHeight + 'px'}"
    >
      <view 
        class="message-item" 
        v-for="(msg, index) in messageList" 
        :key="index"
        :class="{'my-message': msg.isMe, 'other-message': !msg.isMe}"
      >
        <!-- AI消息 - 头像在左边 -->
        <image 
          v-if="!msg.isMe" 
          class="avatar" 
          :src="msg.avatar" 
          mode="aspectFill"
        />
        
        <view class="message-content">
          <!-- AI消息显示昵称 -->
          <text v-if="!msg.isMe" class="sender-name">{{ msg.sender }}</text>
          <view class="message-bubble" :class="{'message-loading': msg.isLoading}">
            <!-- 文本消息 -->
            <text v-if="msg.type === 'text'" class="message-text">
              {{ msg.content }}
              <text v-if="msg.isLoading" class="loading-dots"></text>
            </text>
            <!-- 图片消息 -->
            <image 
              v-else-if="msg.type === 'image'" 
              class="message-image" 
              :src="msg.imageUrl" 
              mode="widthFix"
              @tap="previewImage(msg.imageUrl)"
            />
          </view>
          <text class="message-time">{{ msg.time }}</text>
        </view>
        
        <!-- 我的消息 - 头像在右边 -->
        <image 
          v-if="msg.isMe" 
          class="avatar" 
          :src="msg.avatar" 
          mode="aspectFill"
        />
      </view>
      
      <!-- 底部占位，避免消息被输入框遮挡 -->
      <view class="message-bottom-placeholder"></view>
    </scroll-view>

    <!-- 底部输入区域 - 固定定位 -->
    <view class="input-area-fixed" :id="inputAreaId">
      <view class="input-area-content">
        <!-- 图片选择按钮 -->
        <view class="image-btn" @tap="chooseImage">
          <text class="image-icon">📷</text>
        </view>
        <input 
          class="text-input" 
          v-model="inputText" 
          placeholder="输入消息..." 
          @confirm="sendMessage"
          :focus="autoFocus"
          :disabled="isLoading"
          adjust-position
        />
        <button 
          class="send-btn" 
          @tap="sendMessage" 
          :disabled="(!inputText.trim() && !tempImagePath) || isLoading"
        >
          {{ isLoading ? '发送中...' : '发送' }}
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      inputText: '',
      messageList: [],
      scrollTop: 0,
      autoFocus: false,
      isChoosingImage: false,
      tempImagePath: '',
      inputAreaHeight: 120,
      inputAreaId: 'inputArea_' + Date.now(),
      isLoading: false,
      userInfo: {
        avatar: '/static/avatars/user-avatar.jpg',
        name: '我'
      },
      aiInfo: {
        avatar: '/static/avatars/PRTS.png',
        name: 'PRTS'
      },
      // DeepSeek API配置
      deepseekConfig: {
        // 请替换为你的真实API Key
        apiKey: 'sk-1a8b605d7f5c433c9223c2c47085f1ef',
        apiUrl: 'https://api.deepseek.com/v1/chat/completions',
        model: 'deepseek-chat',
        maxTokens: 2000,
        temperature: 0.7
      },
      // 系统提示词
      systemPrompt: '你是一个友好、有帮助的AI助手。回答要简洁、自然，像真人对话一样。',
      // 初始消息
      initialMessages: [
        { 
          content: '你好！我是PRTS，今天博士想要查询什么记录吗？', 
          time: '10:00', 
          isMe: false, 
          avatar: '/static/avatars/PRTS.png',
          sender: 'PRTS',
          type: 'text'
        }
      ]
    }
  },
  onLoad(options) {
    console.log('页面跳转携带的数据:', options)
    
    // 初始化消息列表
    this.messageList = [...this.initialMessages]
    
    // 自动聚焦输入框
    setTimeout(() => {
      this.autoFocus = true
    }, 300)
  },
  onReady() {
    // 获取输入区域的实际高度
    this.getInputAreaHeight()
  },
  methods: {
    // 获取输入区域高度
    getInputAreaHeight() {
      const query = uni.createSelectorQuery().in(this)
      query.select('.input-area-fixed').boundingClientRect(data => {
        if (data) {
          this.inputAreaHeight = data.height
          console.log('输入区域高度:', this.inputAreaHeight)
          
          // 滚动到底部
          this.$nextTick(() => {
            this.scrollToBottom()
          })
        }
      }).exec()
    },

    // 发送消息
    async sendMessage() {
      if (!this.inputText.trim() && !this.tempImagePath) {
        uni.showToast({
          title: '消息不能为空',
          icon: 'none'
        })
        return
      }

      // 用户的消息
      const userMessage = {
        content: this.inputText.trim(),
        time: this.getCurrentTime(),
        isMe: true,
        avatar: this.userInfo.avatar,
        sender: this.userInfo.name,
        type: this.tempImagePath ? 'image' : 'text',
        imageUrl: this.tempImagePath || ''
      }

      // 添加到消息列表
      this.messageList.push(userMessage)
      
      // 保存用户输入
      const userInput = this.inputText
      
      // 清空输入框和临时图片
      this.inputText = ''
      this.tempImagePath = ''
      
      // 滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom()
      })

      // 如果是图片消息，先处理图片（原功能保留）
      if (userMessage.type === 'image') {
        // 这里可以添加图片识别或处理逻辑
        this.callDeepSeekAPI('我发送了一张图片，请描述一下或者给出相关回应')
      } else {
        // 如果是文本消息，调用DeepSeek
        this.callDeepSeekAPI(userInput)
      }
    },

    // 调用DeepSeek API
    async callDeepSeekAPI(userInput) {
      // 添加"正在思考"状态
      const thinkingMessage = {
        content: '正在思考...',
        time: this.getCurrentTime(),
        isMe: false,
        avatar: this.aiInfo.avatar,
        sender: this.aiInfo.name,
        type: 'text',
        isLoading: true
      }
      this.messageList.push(thinkingMessage)
      
      this.$nextTick(() => {
        this.scrollToBottom()
      })

      try {
        this.isLoading = true
        
        // 构建消息历史（保留最近10条对话）
        const messages = [
          {
            role: 'system',
            content: this.systemPrompt
          }
        ]
        
        // 添加历史消息（排除正在加载的消息）
        const historyMessages = this.messageList
          .filter(msg => !msg.isLoading)
          .slice(-10) // 保留最近10条
          .map(msg => ({
            role: msg.isMe ? 'user' : 'assistant',
            content: msg.content
          }))
        
        messages.push(...historyMessages)
        
        console.log('发送到API的消息:', messages)

        // 调用DeepSeek API
        const response = await new Promise((resolve, reject) => {
          uni.request({
            url: this.deepseekConfig.apiUrl,
            method: 'POST',
            timeout: 30000,
            header: {
              'Authorization': `Bearer ${this.deepseekConfig.apiKey}`,
              'Content-Type': 'application/json'
            },
            data: {
              model: this.deepseekConfig.model,
              messages: messages,
              max_tokens: this.deepseekConfig.maxTokens,
              temperature: this.deepseekConfig.temperature,
              stream: false
            },
            success: resolve,
            fail: reject
          })
        })

        console.log('API响应:', response)

        // 移除"正在思考"消息
        this.messageList = this.messageList.filter(msg => !msg.isLoading)

        if (response.statusCode === 200 && 
            response.data && 
            response.data.choices && 
            response.data.choices[0]) {
          
          // 添加AI回复
          const aiMessage = {
            content: response.data.choices[0].message.content.trim(),
            time: this.getCurrentTime(),
            isMe: false,
            avatar: this.aiInfo.avatar,
            sender: this.aiInfo.name,
            type: 'text'
          }
          this.messageList.push(aiMessage)
          
        } else {
          // 添加错误消息
          const errorMessage = {
            content: '抱歉，我暂时无法回复。请稍后再试。',
            time: this.getCurrentTime(),
            isMe: false,
            avatar: this.aiInfo.avatar,
            sender: this.aiInfo.name,
            type: 'text'
          }
          this.messageList.push(errorMessage)
          
          uni.showToast({
            title: 'AI回复异常',
            icon: 'none'
          })
        }

        this.$nextTick(() => {
          this.scrollToBottom()
        })

      } catch (error) {
        console.error('AI调用失败:', error)
        
        // 移除"正在思考"消息
        this.messageList = this.messageList.filter(msg => !msg.isLoading)
        
        // 添加错误消息
        const errorMessage = {
          content: '网络连接失败，请检查网络设置。',
          time: this.getCurrentTime(),
          isMe: false,
          avatar: this.aiInfo.avatar,
          sender: this.aiInfo.name,
          type: 'text'
        }
        this.messageList.push(errorMessage)
        
        uni.showToast({
          title: '请求失败',
          icon: 'none'
        })
        
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      } finally {
        this.isLoading = false
      }
    },

    // 选择图片（原功能保留）
    chooseImage() {
      if (this.isChoosingImage) return
      
      this.isChoosingImage = true
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          console.log('选择图片成功:', res.tempFilePaths[0])
          this.tempImagePath = res.tempFilePaths[0]
          // 自动发送图片
          this.sendMessage()
        },
        fail: (err) => {
          console.log('选择图片失败:', err)
          uni.showToast({
            title: '选择图片失败',
            icon: 'none'
          })
        },
        complete: () => {
          this.isChoosingImage = false
        }
      })
    },

    // 预览图片（原功能保留）
    previewImage(url) {
      uni.previewImage({
        urls: [url],
        current: url
      })
    },

    // 获取当前时间
    getCurrentTime() {
      const now = new Date()
      return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    },

    // 滚动到底部
    scrollToBottom() {
      setTimeout(() => {
        this.scrollTop = 999999
      }, 100)
    },

    onScroll(e) {
      // 可以在这里处理滚动事件
    }
  }
}
</script>

<style>
.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  position: relative;
}

.chat-header {
  background: #d4a762;
  padding: 30rpx;
  text-align: center;
  border-bottom: 1rpx solid #e5e5e5;
  position: relative;
  z-index: 10;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
}

.chat-messages {
  flex: 1;
  padding: 20rpx;
  background: #f8f1e9;
  box-sizing: border-box;
  position: relative;
}

/* 消息底部占位 */
.message-bottom-placeholder {
  height: 40rpx;
}

/* 消息项通用样式 */
.message-item {
  margin-bottom: 40rpx;
  display: flex;
  align-items: flex-start;
}

/* 对方消息样式 */
.other-message {
  justify-content: flex-start;
}

.other-message .avatar {
  margin-right: 20rpx;
}

.other-message .message-content {
  align-items: flex-start;
  max-width: 70%;
}

.other-message .message-bubble {
  background: #fff;
  border-radius: 10rpx 20rpx 20rpx 10rpx;
}

.other-message .message-bubble::before {
  content: '';
  position: absolute;
  left: -10rpx;
  top: 0;
  border: 10rpx solid transparent;
  border-right-color: #fff;
}

/* 我的消息样式 */
.my-message {
  justify-content: flex-end;
}

.my-message .avatar {
  margin-left: 20rpx;
  order: 2;
}

.my-message .message-content {
  align-items: flex-end;
  max-width: 70%;
  order: 1;
}

.my-message .message-bubble {
  background: #95ec69;
  border-radius: 20rpx 10rpx 10rpx 20rpx;
}

.my-message .message-bubble::before {
  content: '';
  position: absolute;
  right: -10rpx;
  top: 0;
  border: 10rpx solid transparent;
  border-left-color: #95ec69;
}

/* 头像 */
.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 10rpx;
  flex-shrink: 0;
}

/* 消息内容区域 */
.message-content {
  display: flex;
  flex-direction: column;
  position: relative;
}

/* 发送者名称 */
.sender-name {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 8rpx;
  margin-left: 10rpx;
}

/* 消息气泡 */
.message-bubble {
  padding: 20rpx 24rpx;
  position: relative;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
  max-width: 100%;
}

/* 加载中的消息样式 */
.message-loading {
  opacity: 0.7;
}

.message-loading .message-bubble {
  background: #e0e0e0;
}

/* 加载动画 */
.loading-dots {
  display: inline-block;
}

.loading-dots::after {
  content: '...';
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { content: '.'; }
  33% { content: '..'; }
  66% { content: '...'; }
  100% { content: '.'; }
}

/* 消息文本 */
.message-text {
  font-size: 32rpx;
  color: #333;
  line-height: 1.4;
  word-break: break-word;
}

/* 消息图片 */
.message-image {
  max-width: 300rpx;
  max-height: 400rpx;
  border-radius: 10rpx;
  display: block;
}

/* 消息时间 */
.message-time {
  font-size: 22rpx;
  color: #999;
  margin-top: 8rpx;
  text-align: center;
}

/* 固定定位的输入区域 */
.input-area-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #f8f1e9;
  border-top: 1rpx solid #e5e5e5;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom); /* 适配刘海屏 */
}

.input-area-content {
  display: flex;
  padding: 20rpx;
  align-items: center;
  box-sizing: border-box;
}

/* 图片按钮 */
.image-btn {
  padding: 20rpx;
  margin-right: 20rpx;
  background: #f5f5f5;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-icon {
  font-size: 40rpx;
}

.text-input {
  flex: 1;
  background: #f5f5f5;
  border-radius: 10rpx;
  padding: 20rpx 30rpx;
  margin-right: 20rpx;
  font-size: 32rpx;
  border: 1rpx solid #e5e5e5;
}

.text-input:disabled {
  background: #f0f0f0;
  color: #999;
}

.send-btn {
  background: #07c160;
  color: #fff;
  border-radius: 10rpx;
  padding: 20rpx 40rpx;
  font-size: 32rpx;
  border: none;
  transition: all 0.3s;
}

.send-btn:disabled {
  background: #cccccc;
  color: #999;
}
</style>