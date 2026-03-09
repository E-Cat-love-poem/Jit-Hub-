"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  // 生命周期函数保持不变
  onLoad(options) {
    common_vendor.index.__f__("log", "at pages/yue/yue.vue:36", "页面加载", options);
  },
  onShow() {
    common_vendor.index.__f__("log", "at pages/yue/yue.vue:40", "页面显示");
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f3924085"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/yue/yue.js.map
