<template>
  <view class="chat-page">
    <!-- 顶部标题 -->
    <view class="chat-header">
      <text class="header-title">聊天室</text>
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
        <!-- 对方消息 - 头像在左边 -->
        <image 
          v-if="!msg.isMe" 
          class="avatar" 
          :src="msg.avatar" 
          mode="aspectFill"
        />
        
        <view class="message-content">
          <!-- 对方消息显示昵称 -->
          <text v-if="!msg.isMe" class="sender-name">{{ msg.sender }}</text>
          <view class="message-bubble">
            <!-- 文本消息 -->
            <text v-if="msg.type === 'text'" class="message-text">{{ msg.content }}</text>
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
          adjust-position
        />
        <button class="send-btn" @tap="sendMessage" :disabled="!inputText.trim() && !tempImagePath">发送</button>
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
      inputAreaHeight: 120, // 默认高度，会在onReady中获取实际高度
      inputAreaId: 'inputArea_' + Date.now(), // 唯一ID用于查询节点
      userInfo: {
        avatar: '/static/avatars/user-avatar.jpg',
        name: '我'
      },
      friendInfo: {
        avatar: '/static/avatars/friend-avatar.jpg',
        name: '好友'
      },
      // 模拟一些初始消息
      initialMessages: [
        { 
          content: '在吗在吗？这只猫猫好像你呀~', 
          time: '10:00', 
          isMe: false, 
          avatar: '/static/avatars/friend-avatar.jpg',
          sender: '好友',
          type: 'text'
        },
        {
          time: '10:01', 
          isMe: false, 
          avatar: '/static/avatars/friend-avatar.jpg',
          sender: '好友',
          type: 'image',
          imageUrl: '/static/avatars/user-avatar.jpg'
        },
        { 
          content: '确实呢~', 
          time: '10:01', 
          isMe: true, 
          avatar: '/static/avatars/user-avatar.jpg',
          sender: '我',
          type: 'text'
        },
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
    sendMessage() {
      if (!this.inputText.trim() && !this.tempImagePath) {
        uni.showToast({
          title: '消息不能为空',
          icon: 'none'
        })
        return
      }

      const newMessage = {
        content: this.inputText.trim(),
        time: this.getCurrentTime(),
        isMe: true,
        avatar: this.userInfo.avatar,
        sender: this.userInfo.name,
        type: this.tempImagePath ? 'image' : 'text',
        imageUrl: this.tempImagePath || ''
      }

      // 添加到消息列表
      this.messageList.push(newMessage)
      
      // 清空输入框和临时图片
      this.inputText = ''
      this.tempImagePath = ''
      
      // 滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom()
      })

      // 模拟回复
      this.simulateReply()
    },

    // 选择图片
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

    // 预览图片
    previewImage(url) {
      uni.previewImage({
        urls: [url],
        current: url
      })
    },

    // 模拟对方回复
    simulateReply() {
      setTimeout(() => {
        const replies = [
          '收到你的消息了！',
          '哈哈，有意思~',
          '图片不错！',
          '我在听呢',
          '不错不错 👍',
          '这个想法很好！',
          '明天见面聊吧',
          '记得按时吃饭哦'
        ]
        const randomReply = replies[Math.floor(Math.random() * replies.length)]
        
        const replyMessage = {
          content: randomReply,
          time: this.getCurrentTime(),
          isMe: false,
          avatar: this.friendInfo.avatar,
          sender: this.friendInfo.name,
          type: 'text'
        }
        
        this.messageList.push(replyMessage)
        
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }, 800 + Math.random() * 1000)
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