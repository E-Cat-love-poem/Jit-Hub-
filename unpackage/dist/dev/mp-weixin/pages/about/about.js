"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      // 可以在这里定义动态数据
    };
  },
  onLoad(options) {
    common_vendor.index.__f__("log", "at pages/about/about.vue:71", "页面加载");
  },
  methods: {
    // 复制微信号
    copyWechat() {
      common_vendor.index.setClipboardData({
        data: "trad-crafts",
        success: () => {
          common_vendor.index.showToast({
            title: "已复制微信号",
            icon: "success"
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/about/about.vue:86", "复制失败:", err);
          common_vendor.index.showToast({
            title: "复制失败",
            icon: "none"
          });
        }
      });
    },
    // 拨打电话
    makePhoneCall() {
      common_vendor.index.makePhoneCall({
        phoneNumber: "要三酒-啤酒白酒葡萄酒",
        success: () => {
          common_vendor.index.__f__("log", "at pages/about/about.vue:100", "拨打电话成功");
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/about/about.vue:103", "拨打电话失败:", err);
          common_vendor.index.showToast({
            title: "拨号失败",
            icon: "none"
          });
        }
      });
    },
    // 发送邮件
    openEmail() {
      common_vendor.index.showModal({
        title: "发送邮件",
        content: "是否要发送邮件到 广州软件学院-微信小程序应用开发@JE.Class？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.setClipboardData({
              data: "contact@trad-crafts.com",
              success: () => {
                common_vendor.index.showToast({
                  title: "已发送邮箱地址",
                  icon: "success"
                });
              },
              fail: (err) => {
                common_vendor.index.__f__("error", "at pages/about/about.vue:128", "发送失败:", err);
                common_vendor.index.showToast({
                  title: "发送失败",
                  icon: "none"
                });
              }
            });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$4,
    b: common_assets._imports_0,
    c: common_assets._imports_0,
    d: common_assets._imports_0,
    e: common_assets._imports_2$2,
    f: common_vendor.o((...args) => $options.copyWechat && $options.copyWechat(...args)),
    g: common_assets._imports_2$2,
    h: common_vendor.o((...args) => $options.makePhoneCall && $options.makePhoneCall(...args)),
    i: common_assets._imports_2$2,
    j: common_vendor.o((...args) => $options.openEmail && $options.openEmail(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-13a78ac6"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/about/about.js.map
