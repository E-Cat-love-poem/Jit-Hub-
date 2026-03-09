"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/Login/Login.js";
  "./pages/Home/Home.js";
  "./pages/Register/Register.js";
  "./pages/detail/detail.js";
  "./pages/user/user.js";
  "./pages/yue/yue.js";
  "./pages/shop/shop.js";
  "./pages/about/about.js";
  "./pages/chat/chat.js";
  "./pages/upload/upload.js";
  "./pages/ai/ai.js";
  "./pages/purchased/purchased.js";
  "./pages/exam/exam.js";
  "./pages/chat2/chat2.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.wx$1.cloud.init({
      env: "cloud1-0gpacbi01728ba35",
      // 在云开发控制台查看
      traceUser: true
    });
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:10", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:13", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
