"use strict";
const common_vendor = require("../common/vendor.js");
const baseURL = "http://localhost:8088";
const request = (options) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: baseURL + options.url,
      method: options.method || "GET",
      data: options.data || {},
      header: {
        "Content-Type": "application/json",
        "Authorization": common_vendor.index.getStorageSync("token") || ""
        // uni-app使用uni.getStorageSync
      },
      success: (res) => {
        var _a;
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          common_vendor.index.showToast({
            title: ((_a = res.data) == null ? void 0 : _a.message) || `请求失败[${res.statusCode}]`,
            icon: "none"
          });
          reject(res.data);
        }
      },
      fail: (err) => {
        common_vendor.index.showToast({
          title: err.errMsg || "网络错误",
          icon: "none"
        });
        reject(err);
      }
    });
  });
};
const get = (url, data) => request({ url, method: "GET", data });
const post = (url, data) => request({ url, method: "POST", data });
const put = (url, data) => request({ url, method: "PUT", data });
exports.get = get;
exports.post = post;
exports.put = put;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
