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
      // 默认高度，会在onReady中获取实际高度
      inputAreaId: "inputArea_" + Date.now(),
      // 唯一ID用于查询节点
      userInfo: {
        avatar: "/static/avatars/user-avatar.jpg",
        name: "我"
      },
      friendInfo: {
        avatar: "/static/avatars/friend-avatar.jpg",
        name: "好友"
      },
      // 模拟一些初始消息
      initialMessages: [
        {
          content: "在吗在吗？这只猫猫好像你呀~",
          time: "10:00",
          isMe: false,
          avatar: "/static/avatars/friend-avatar.jpg",
          sender: "好友",
          type: "text"
        },
        {
          time: "10:01",
          isMe: false,
          avatar: "/static/avatars/friend-avatar.jpg",
          sender: "好友",
          type: "image",
          imageUrl: "/static/avatars/user-avatar.jpg"
        },
        {
          content: "确实呢~",
          time: "10:01",
          isMe: true,
          avatar: "/static/avatars/user-avatar.jpg",
          sender: "我",
          type: "text"
        }
      ]
    };
  },
  onLoad(options) {
    common_vendor.index.__f__("log", "at pages/chat/chat.vue:133", "页面跳转携带的数据:", options);
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
          common_vendor.index.__f__("log", "at pages/chat/chat.vue:154", "输入区域高度:", this.inputAreaHeight);
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        }
      }).exec();
    },
    // 发送消息
    sendMessage() {
      if (!this.inputText.trim() && !this.tempImagePath) {
        common_vendor.index.showToast({
          title: "消息不能为空",
          icon: "none"
        });
        return;
      }
      const newMessage = {
        content: this.inputText.trim(),
        time: this.getCurrentTime(),
        isMe: true,
        avatar: this.userInfo.avatar,
        sender: this.userInfo.name,
        type: this.tempImagePath ? "image" : "text",
        imageUrl: this.tempImagePath || ""
      };
      this.messageList.push(newMessage);
      this.inputText = "";
      this.tempImagePath = "";
      this.$nextTick(() => {
        this.scrollToBottom();
      });
      this.simulateReply();
    },
    // 选择图片
    chooseImage() {
      if (this.isChoosingImage)
        return;
      this.isChoosingImage = true;
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/chat/chat.vue:210", "选择图片成功:", res.tempFilePaths[0]);
          this.tempImagePath = res.tempFilePaths[0];
          this.sendMessage();
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/chat/chat.vue:216", "选择图片失败:", err);
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
    // 预览图片
    previewImage(url) {
      common_vendor.index.previewImage({
        urls: [url],
        current: url
      });
    },
    // 模拟对方回复
    simulateReply() {
      setTimeout(() => {
        const replies = [
          "收到你的消息了！",
          "哈哈，有意思~",
          "图片不错！",
          "我在听呢",
          "不错不错 👍",
          "这个想法很好！",
          "明天见面聊吧",
          "记得按时吃饭哦"
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        const replyMessage = {
          content: randomReply,
          time: this.getCurrentTime(),
          isMe: false,
          avatar: this.friendInfo.avatar,
          sender: this.friendInfo.name,
          type: "text"
        };
        this.messageList.push(replyMessage);
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }, 800 + Math.random() * 1e3);
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
      }, msg.type === "text" ? {
        f: common_vendor.t(msg.content)
      } : msg.type === "image" ? {
        h: msg.imageUrl,
        i: common_vendor.o(($event) => $options.previewImage(msg.imageUrl), index)
      } : {}, {
        g: msg.type === "image",
        j: common_vendor.t(msg.time),
        k: msg.isMe
      }, msg.isMe ? {
        l: msg.avatar
      } : {}, {
        m: index,
        n: msg.isMe ? 1 : "",
        o: !msg.isMe ? 1 : ""
      });
    }),
    b: $data.scrollTop,
    c: common_vendor.o((...args) => $options.onScroll && $options.onScroll(...args)),
    d: $data.inputAreaHeight + "px",
    e: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    f: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    g: $data.autoFocus,
    h: $data.inputText,
    i: common_vendor.o(($event) => $data.inputText = $event.detail.value),
    j: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    k: !$data.inputText.trim() && !$data.tempImagePath,
    l: $data.inputAreaId
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chat/chat.js.map
