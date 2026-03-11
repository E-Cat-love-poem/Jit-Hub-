"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  setup() {
    common_vendor.useRouter();
    const loading = common_vendor.ref(false);
    const formData = common_vendor.reactive({
      user_name: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
    const validateForm = (user_name, email, password, confirmPassword) => {
      let isValid = true;
      if (!/^[a-zA-Z0-9]{4,16}$/.test(user_name)) {
        common_vendor.index.showToast({
          title: "用户名需4-16位字母或数字",
          icon: "none"
        });
        isValid = false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        common_vendor.index.showToast({
          title: "请输入有效的邮箱地址",
          icon: "none"
        });
        isValid = false;
      }
      if (password.length < 6 || password.length > 20) {
        common_vendor.index.showToast({
          title: "密码需6-20位字符",
          icon: "none"
        });
        isValid = false;
      }
      if (password !== confirmPassword) {
        common_vendor.index.showToast({
          title: "两次密码输入不一致",
          icon: "none"
        });
        isValid = false;
      }
      return isValid;
    };
    const handleRegister = async (e) => {
      var _a;
      let user_name, email, password, confirmPassword;
      if (e && e.detail && e.detail.value) {
        user_name = e.detail.value.user_name || formData.user_name;
        email = e.detail.value.email || formData.email;
        password = e.detail.value.password || formData.password;
        confirmPassword = e.detail.value.confirmPassword || formData.confirmPassword;
      } else {
        user_name = formData.user_name;
        email = formData.email;
        password = formData.password;
        confirmPassword = formData.confirmPassword;
      }
      if (!validateForm(user_name, email, password, confirmPassword)) {
        return;
      }
      loading.value = true;
      try {
        const res = await utils_request.post("/user/register", {
          user_name,
          email,
          password
        });
        if (res.success) {
          common_vendor.index.showToast({
            title: "注册成功",
            icon: "success",
            duration: 1500,
            success: () => {
              setTimeout(() => {
                common_vendor.index.navigateBack({
                  delta: 1,
                  success: () => {
                    common_vendor.index.__f__("log", "at pages/Register/Register.vue:164", "返回登录页成功");
                  }
                });
              }, 1500);
            }
          });
        } else {
          common_vendor.index.showToast({
            title: res.message || "注册失败",
            icon: "none"
          });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/Register/Register.vue:177", "完整错误响应:", err);
        common_vendor.index.showToast({
          title: ((_a = err.data) == null ? void 0 : _a.message) || (err.statusCode === 500 ? "服务器内部错误" : "注册失败，请检查输入"),
          icon: "none",
          duration: 3e3
        });
      } finally {
        loading.value = false;
      }
    };
    return {
      loading,
      formData,
      handleRegister
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$2,
    b: $setup.formData.user_name,
    c: common_vendor.o(($event) => $setup.formData.user_name = $event.detail.value),
    d: $setup.formData.email,
    e: common_vendor.o(($event) => $setup.formData.email = $event.detail.value),
    f: $setup.formData.password,
    g: common_vendor.o(($event) => $setup.formData.password = $event.detail.value),
    h: $setup.formData.confirmPassword,
    i: common_vendor.o(($event) => $setup.formData.confirmPassword = $event.detail.value),
    j: $setup.loading,
    k: common_vendor.o((...args) => $setup.handleRegister && $setup.handleRegister(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6b0433d4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Register/Register.js.map
