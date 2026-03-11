"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      inputText: "",
      messageList: [],
      scrollTop: 0,
      autoFocus: false,
      isChoosingImage: false,
      tempImagePath: "",
      inputAreaHeight: 120,
      inputAreaId: "inputArea_" + Date.now(),
      isLoading: false,
      userInfo: {
        avatar: "/static/avatars/user-avatar.jpg",
        name: "我"
      },
      aiInfo: {
        avatar: "/static/avatars/PRTS.png",
        name: "PRTS"
      },
      // DeepSeek API配置
      deepseekConfig: {
        // 请替换为你的真实API Key
        apiKey: "sk-1a8b605d7f5c433c9223c2c47085f1ef",
        apiUrl: "https://api.deepseek.com/v1/chat/completions",
        model: "deepseek-chat",
        maxTokens: 2e3,
        temperature: 0.7
      },
      // 系统提示词
      systemPrompt: "你是一个友好、有帮助的AI助手。回答要简洁、自然，像真人对话一样。",
      // 初始消息
      initialMessages: [
        {
          content: "你好！我是PRTS，今天博士想要查询什么记录吗？",
          time: "10:00",
          isMe: false,
          avatar: "/static/avatars/PRTS.png",
          sender: "PRTS",
          type: "text"
        }
      ]
    };
  },
  onLoad(options) {
    common_vendor.index.__f__("log", "at pages/ai/ai.vue:139", "页面跳转携带的数据:", options);
    this.messageList = [...this.initialMessages];
    setTimeout(() => {
      this.autoFocus = true;
    }, 300);
  },
  onReady() {
    this.getInputAreaHeight();
  },
  methods: {
    // 获取输入区域高度
    getInputAreaHeight() {
      const query = common_vendor.index.createSelectorQuery().in(this);
      query.select(".input-area-fixed").boundingClientRect((data) => {
        if (data) {
          this.inputAreaHeight = data.height;
          common_vendor.index.__f__("log", "at pages/ai/ai.vue:160", "输入区域高度:", this.inputAreaHeight);
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        }
      }).exec();
    },
    // 发送消息
    async sendMessage() {
      if (!this.inputText.trim() && !this.tempImagePath) {
        common_vendor.index.showToast({
          title: "消息不能为空",
          icon: "none"
        });
        return;
      }
      const userMessage = {
        content: this.inputText.trim(),
        time: this.getCurrentTime(),
        isMe: true,
        avatar: this.userInfo.avatar,
        sender: this.userInfo.name,
        type: this.tempImagePath ? "image" : "text",
        imageUrl: this.tempImagePath || ""
      };
      this.messageList.push(userMessage);
      const userInput = this.inputText;
      this.inputText = "";
      this.tempImagePath = "";
      this.$nextTick(() => {
        this.scrollToBottom();
      });
      if (userMessage.type === "image") {
        this.callDeepSeekAPI("我发送了一张图片，请描述一下或者给出相关回应");
      } else {
        this.callDeepSeekAPI(userInput);
      }
    },
    // 调用DeepSeek API
    async callDeepSeekAPI(userInput) {
      const thinkingMessage = {
        content: "正在思考...",
        time: this.getCurrentTime(),
        isMe: false,
        avatar: this.aiInfo.avatar,
        sender: this.aiInfo.name,
        type: "text",
        isLoading: true
      };
      this.messageList.push(thinkingMessage);
      this.$nextTick(() => {
        this.scrollToBottom();
      });
      try {
        this.isLoading = true;
        const messages = [
          {
            role: "system",
            content: this.systemPrompt
          }
        ];
        const historyMessages = this.messageList.filter((msg) => !msg.isLoading).slice(-10).map((msg) => ({
          role: msg.isMe ? "user" : "assistant",
          content: msg.content
        }));
        messages.push(...historyMessages);
        common_vendor.index.__f__("log", "at pages/ai/ai.vue:256", "发送到API的消息:", messages);
        const response = await new Promise((resolve, reject) => {
          common_vendor.index.request({
            url: this.deepseekConfig.apiUrl,
            method: "POST",
            timeout: 3e4,
            header: {
              "Authorization": `Bearer ${this.deepseekConfig.apiKey}`,
              "Content-Type": "application/json"
            },
            data: {
              model: this.deepseekConfig.model,
              messages,
              max_tokens: this.deepseekConfig.maxTokens,
              temperature: this.deepseekConfig.temperature,
              stream: false
            },
            success: resolve,
            fail: reject
          });
        });
        common_vendor.index.__f__("log", "at pages/ai/ai.vue:280", "API响应:", response);
        this.messageList = this.messageList.filter((msg) => !msg.isLoading);
        if (response.statusCode === 200 && response.data && response.data.choices && response.data.choices[0]) {
          const aiMessage = {
            content: response.data.choices[0].message.content.trim(),
            time: this.getCurrentTime(),
            isMe: false,
            avatar: this.aiInfo.avatar,
            sender: this.aiInfo.name,
            type: "text"
          };
          this.messageList.push(aiMessage);
        } else {
          const errorMessage = {
            content: "抱歉，我暂时无法回复。请稍后再试。",
            time: this.getCurrentTime(),
            isMe: false,
            avatar: this.aiInfo.avatar,
            sender: this.aiInfo.name,
            type: "text"
          };
          this.messageList.push(errorMessage);
          common_vendor.index.showToast({
            title: "AI回复异常",
            icon: "none"
          });
        }
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/ai/ai.vue:324", "AI调用失败:", error);
        this.messageList = this.messageList.filter((msg) => !msg.isLoading);
        const errorMessage = {
          content: "网络连接失败，请检查网络设置。",
          time: this.getCurrentTime(),
          isMe: false,
          avatar: this.aiInfo.avatar,
          sender: this.aiInfo.name,
          type: "text"
        };
        this.messageList.push(errorMessage);
        common_vendor.index.showToast({
          title: "请求失败",
          icon: "none"
        });
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      } finally {
        this.isLoading = false;
      }
    },
    // 选择图片（原功能保留）
    chooseImage() {
      if (this.isChoosingImage)
        return;
      this.isChoosingImage = true;
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/ai/ai.vue:363", "选择图片成功:", res.tempFilePaths[0]);
          this.tempImagePath = res.tempFilePaths[0];
          this.sendMessage();
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/ai/ai.vue:369", "选择图片失败:", err);
          common_vendor.index.showToast({
            title: "选择图片失败",
            icon: "none"
          });
        },
        complete: () => {
          this.isChoosingImage = false;
        }
      });
    },
    // 预览图片（原功能保留）
    previewImage(url) {
      common_vendor.index.previewImage({
        urls: [url],
        current: url
      });
    },
    // 获取当前时间
    getCurrentTime() {
      const now = /* @__PURE__ */ new Date();
      return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    },
    // 滚动到底部
    scrollToBottom() {
      setTimeout(() => {
        this.scrollTop = 999999;
      }, 100);
    },
    onScroll(e) {
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.messageList, (msg, index, i0) => {
      return common_vendor.e({
        a: !msg.isMe
      }, !msg.isMe ? {
        b: msg.avatar
      } : {}, {
        c: !msg.isMe
      }, !msg.isMe ? {
        d: common_vendor.t(msg.sender)
      } : {}, {
        e: msg.type === "text"
      }, msg.type === "text" ? common_vendor.e({
        f: common_vendor.t(msg.content),
        g: msg.isLoading
      }, msg.isLoading ? {} : {}) : msg.type === "image" ? {
        i: msg.imageUrl,
        j: common_vendor.o(($event) => $options.previewImage(msg.imageUrl), index)
      } : {}, {
        h: msg.type === "image",
        k: msg.isLoading ? 1 : "",
        l: common_vendor.t(msg.time),
        m: msg.isMe
      }, msg.isMe ? {
        n: msg.avatar
      } : {}, {
        o: index,
        p: msg.isMe ? 1 : "",
        q: !msg.isMe ? 1 : ""
      });
    }),
    b: $data.scrollTop,
    c: common_vendor.o((...args) => $options.onScroll && $options.onScroll(...args)),
    d: $data.inputAreaHeight + "px",
    e: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    f: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    g: $data.autoFocus,
    h: $data.isLoading,
    i: $data.inputText,
    j: common_vendor.o(($event) => $data.inputText = $event.detail.value),
    k: common_vendor.t($data.isLoading ? "发送中..." : "发送"),
    l: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    m: !$data.inputText.trim() && !$data.tempImagePath || $data.isLoading,
    n: $data.inputAreaId
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/ai/ai.js.map
