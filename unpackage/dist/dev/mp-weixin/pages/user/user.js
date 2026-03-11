"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  setup() {
    const clickCount = common_vendor.ref(0);
    const userInfo = common_vendor.ref({
      name: "未登录用户",
      userId: "--",
      level: "Lv.0",
      levelProgress: 0
    });
    const navigateToEditProfile = () => {
      common_vendor.index.navigateTo({
        url: "/pages/about/about",
        success: () => common_vendor.index.__f__("log", "at pages/user/user.vue:110", "跳转到关于页面")
      });
    };
    const navigateToOrder = () => {
      common_vendor.index.switchTab({
        url: "/pages/shop/shop",
        success: () => common_vendor.index.__f__("log", "at pages/user/user.vue:118", "跳转到订单页"),
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/user/user.vue:120", "跳转失败:", err);
          common_vendor.index.showToast({
            title: "跳转失败",
            icon: "none"
          });
        }
      });
    };
    const navigateToAddress = () => {
      common_vendor.index.switchTab({
        url: "/pages/yue/yue",
        success: () => common_vendor.index.__f__("log", "at pages/user/user.vue:133", "跳转到地址管理"),
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/user/user.vue:135", "跳转失败:", err);
          common_vendor.index.showToast({
            title: "跳转失败",
            icon: "none"
          });
        }
      });
    };
    const navigateToSettings = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "设置功能正在开发中，敬请期待",
        showCancel: false,
        confirmText: "我知道了",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.__f__("log", "at pages/user/user.vue:153", "用户点击了我知道了");
          }
        }
      });
    };
    const handleEasterEgg = () => {
      var _a;
      const newCount = clickCount.value + 1;
      clickCount.value = newCount;
      const eggActions = {
        1: () => showModal("我知道你是手滑", "别点昂，点了你项目组长会发出尖锐爆鸣声~"),
        3: () => showModal("🤬 你还点呢？！", "别点了，项目崩了你负责吗？！"),
        5: () => showModal("⚠项目即将崩塌！⚠", "崩了，再点真崩了！！", true),
        7: () => {
          clickCount.value = 0;
          showModal("好了？开心了？给我滚去重新登录！", "", false, () => {
            common_vendor.index.navigateTo({
              url: "/pages/Login/Login",
              fail: (err) => {
                common_vendor.index.__f__("log", "at pages/user/user.vue:175", "跳转到404失败:", err);
              }
            });
          });
        }
      };
      (_a = eggActions[newCount]) == null ? void 0 : _a.call(eggActions);
    };
    const showModal = (title, content, vibrate = false, callback) => {
      common_vendor.index.showModal({
        title,
        content,
        showCancel: false,
        confirmText: vibrate ? "搞你心态" : "真的假的",
        confirmColor: "#07C160",
        success: () => {
          if (vibrate)
            common_vendor.index.vibrateShort();
          callback == null ? void 0 : callback();
        }
      });
    };
    return {
      userInfo,
      navigateToEditProfile,
      navigateToOrder,
      navigateToAddress,
      navigateToSettings,
      handleEasterEgg
    };
  },
  // uni-app 生命周期钩子
  onLoad() {
    this.loadUserInfo();
  },
  onShow() {
    this.loadUserInfo();
  },
  methods: {
    // 将setup中的函数也暴露给options API
    loadUserInfo() {
      const cachedUserInfo = common_vendor.index.getStorageSync("userInfo") || {};
      const userId = cachedUserInfo.userId;
      if (!userId) {
        common_vendor.index.__f__("log", "at pages/user/user.vue:228", "未检测到登录信息");
        return;
      }
      utils_request.get(`/user/info?userId=${Number(userId)}`).then((res) => {
        this.userInfo = {
          ...this.userInfo,
          name: res.user_name || "未知用户",
          userId: res.user_id,
          level: "Lv.3",
          levelProgress: 65
        };
      }).catch((error) => {
        common_vendor.index.__f__("error", "at pages/user/user.vue:243", "加载用户信息失败:", error);
        common_vendor.index.showToast({
          title: "加载用户信息失败",
          icon: "none",
          duration: 2e3
        });
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$3,
    b: common_vendor.t($setup.userInfo.name || "未登录用户"),
    c: common_vendor.t($setup.userInfo.userId || "--"),
    d: common_vendor.o((...args) => $setup.navigateToEditProfile && $setup.navigateToEditProfile(...args)),
    e: common_vendor.t($setup.userInfo.level || "Lv.0"),
    f: $setup.userInfo.levelProgress || 0,
    g: common_assets._imports_1$1,
    h: common_vendor.o((...args) => $setup.navigateToOrder && $setup.navigateToOrder(...args)),
    i: common_assets._imports_2$1,
    j: common_vendor.o((...args) => $setup.navigateToAddress && $setup.navigateToAddress(...args)),
    k: common_assets._imports_3$1,
    l: common_vendor.o((...args) => $setup.navigateToSettings && $setup.navigateToSettings(...args)),
    m: common_assets._imports_4,
    n: common_vendor.o((...args) => $setup.handleEasterEgg && $setup.handleEasterEgg(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0f7520f0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/user.js.map
