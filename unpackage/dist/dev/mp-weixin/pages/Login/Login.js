"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      loading: false,
      formData: {
        user_name: "",
        password: ""
      }
    };
  },
  methods: {
    async handleLogin(e) {
      var _a, _b, _c, _d;
      try {
        this.loading = true;
        const formValue = e.detail.value;
        const loginData = {
          account: formValue.user_name,
          password: formValue.password
        };
        common_vendor.index.__f__("log", "at pages/Login/Login.vue:63", "发送登录请求:", loginData);
        const res = await utils_request.post("/user/login", loginData);
        common_vendor.index.__f__("log", "at pages/Login/Login.vue:67", "登录响应:", res);
        if (res.success) {
          common_vendor.index.__f__("log", "at pages/Login/Login.vue:70", "登录成功");
          common_vendor.index.__f__("log", "at pages/Login/Login.vue:71", "用户ID:", (_a = res.userInfo) == null ? void 0 : _a.user_id);
          common_vendor.index.showToast({
            title: res.message || "登录成功",
            icon: "success"
          });
          common_vendor.index.setStorageSync("user_name", res.user_name || "");
          common_vendor.index.setStorageSync("userInfo", {
            userId: (_b = res.userInfo) == null ? void 0 : _b.user_id,
            userName: (_c = res.userInfo) == null ? void 0 : _c.user_name,
            email: (_d = res.userInfo) == null ? void 0 : _d.email
          });
          if (res.token) {
            common_vendor.index.setStorageSync("token", res.token);
          }
          setTimeout(() => {
            common_vendor.index.switchTab({
              url: "/pages/Home/Home",
              success: () => {
                common_vendor.index.__f__("log", "at pages/Login/Login.vue:95", "跳转到首页成功");
              },
              fail: (err) => {
                common_vendor.index.__f__("log", "at pages/Login/Login.vue:98", "跳转失败:", err);
                common_vendor.index.navigateTo({
                  url: "/pages/Home/Home"
                });
              }
            });
          }, 1500);
        } else {
          common_vendor.index.showToast({
            title: res.message || "登录失败",
            icon: "none"
          });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/Login/Login.vue:113", "登录请求异常:", err);
        common_vendor.index.showToast({
          title: "网络错误，请稍后重试",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    handleForgetPassword() {
      common_vendor.index.__f__("log", "at pages/Login/Login.vue:124", "点击了忘记密码");
      common_vendor.index.showModal({
        title: "提示",
        content: "更多功能正在开发中，敬请期待",
        showCancel: false,
        confirmText: "我知道了",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.__f__("log", "at pages/Login/Login.vue:132", "用户点击了我知道了");
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0,
    b: $data.formData.user_name,
    c: common_vendor.o(($event) => $data.formData.user_name = $event.detail.value),
    d: $data.formData.password,
    e: common_vendor.o(($event) => $data.formData.password = $event.detail.value),
    f: $data.loading,
    g: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    h: common_vendor.o((...args) => $options.handleForgetPassword && $options.handleForgetPassword(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-461d1d79"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Login/Login.js.map
