"use strict";
const common_vendor = require("../common/vendor.js");
const CLOUD_ENV = "cloud1-0gpacbi01728ba35";
const CLOUD_FUNCTION_MAP = {
  "/product": "product",
  "/user": "user",
  "/order": "order"
};
async function callCloudFunction(functionName, data = {}) {
  try {
    try {
      common_vendor.wx$1.cloud.init({
        env: CLOUD_ENV,
        traceUser: true
      });
    } catch (e) {
    }
    const res = await common_vendor.wx$1.cloud.callFunction({
      name: functionName,
      data
    });
    const cloudResult = res.result;
    if (cloudResult && typeof cloudResult === "object" && "code" in cloudResult) {
      if (cloudResult.code === 200) {
        return cloudResult.data;
      } else {
        throw { message: cloudResult.message, code: cloudResult.code };
      }
    }
    return cloudResult;
  } catch (error) {
    throw {
      message: error.message || "云函数调用失败",
      code: error.code || 500
    };
  }
}
function getCloudFunctionName(url) {
  const path = url.split("?")[0];
  for (const [prefix, funcPrefix] of Object.entries(CLOUD_FUNCTION_MAP)) {
    if (path.startsWith(prefix)) {
      const action = path.substring(prefix.length + 1);
      return `${funcPrefix}-${action}`;
    }
  }
  return path.substring(1).replace(/\//g, "-");
}
const request = (options) => {
  return new Promise((resolve, reject) => {
    {
      const functionName = options.cloudFunction || getCloudFunctionName(options.url);
      callCloudFunction(functionName, options.data).then(resolve).catch((err) => {
        common_vendor.index.showToast({ title: err.message, icon: "none" });
        reject(err);
      });
      return;
    }
  });
};
const get = (url, data) => request({ url, method: "GET", data });
const post = (url, data) => request({ url, method: "POST", data });
const put = (url, data) => request({ url, method: "PUT", data });
exports.get = get;
exports.post = post;
exports.put = put;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
