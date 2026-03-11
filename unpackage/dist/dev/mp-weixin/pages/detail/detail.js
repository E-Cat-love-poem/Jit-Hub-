"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  setup() {
    const product = common_vendor.ref({});
    const isLoading = common_vendor.ref(true);
    const productId = common_vendor.ref("");
    const formatTime = (timeString) => {
      if (!timeString)
        return "未知时间";
      try {
        const date = new Date(timeString);
        const localDate = new Date(date.getTime() + 8 * 60 * 60 * 1e3);
        const year = localDate.getUTCFullYear();
        const month = (localDate.getUTCMonth() + 1).toString().padStart(2, "0");
        const day = localDate.getUTCDate().toString().padStart(2, "0");
        const hours = localDate.getUTCHours().toString().padStart(2, "0");
        const minutes = localDate.getUTCMinutes().toString().padStart(2, "0");
        const seconds = localDate.getUTCSeconds().toString().padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/detail/detail.vue:82", "时间格式化错误:", e);
        return timeString;
      }
    };
    common_vendor.onLoad((options) => {
      if (!options.id) {
        common_vendor.index.showToast({
          title: "商品不存在",
          icon: "none"
        });
        setTimeout(() => common_vendor.index.navigateBack(), 1500);
        return;
      }
      productId.value = options.id;
      loadProductDetail();
    });
    const loadProductDetail = async () => {
      isLoading.value = true;
      try {
        const res = await utils_request.get(`/product/detail/${productId.value}`);
        let imageUrl = res.imageUrl || "";
        if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {
          imageUrl = `/static/images/${imageUrl}`;
        } else if (imageUrl.includes("localhost:8090") || imageUrl.includes("localhost")) {
          const filename = imageUrl.split("/").pop();
          imageUrl = `/static/images/${filename}`;
        } else if (!imageUrl || imageUrl === "null" || imageUrl === "undefined") {
          imageUrl = "/static/images/default-product.png";
        }
        product.value = {
          id: res.id,
          name: res.name,
          imageUrl,
          // 使用处理后的URL
          price: res.price,
          origin: res.origin || "未知",
          categoryName: res.categoryName || "未知",
          detail_desc: res.detailDesc || "暂无信息",
          short_desc: res.shortDesc || "<p>暂无信息</p>"
        };
        if (res.shortDesc && !res.shortDesc.startsWith("<")) {
          product.value.short_desc = `<div>${res.shortDesc}</div>`;
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/detail/detail.vue:145", "加载商品详情失败:", err);
        common_vendor.index.showToast({
          title: "加载失败，请重试",
          icon: "none"
        });
      } finally {
        isLoading.value = false;
      }
    };
    const showSuccessModal = (orderData) => {
      common_vendor.index.showModal({
        title: "🎉 购买成功",
        content: `订单创建成功！

订单号：${orderData.id}
商品：${orderData.productName}
金额：¥${orderData.price}

3秒后自动跳转到订单页面`,
        showCancel: false,
        confirmText: "知道了",
        confirmColor: "#e4393c",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.switchTab({
              url: "/pages/shop/shop",
              success: () => {
                setTimeout(() => {
                  common_vendor.index.showToast({
                    title: "已跳转到订单页面",
                    icon: "success",
                    duration: 1500
                  });
                }, 500);
              }
            });
          }
        }
      });
      setTimeout(() => {
        common_vendor.index.switchTab({
          url: "/pages/shop/shop"
        });
      }, 3e3);
    };
    const createOrder = async () => {
      var _a;
      if (!product.value || !product.value.id)
        return;
      common_vendor.index.showLoading({
        title: "创建订单中...",
        mask: true
      });
      try {
        const result = await utils_request.post("/order/create", {
          product_id: product.value.id,
          product_name: product.value.name,
          price: Math.round(product.value.price)
          // 转为分
        });
        common_vendor.index.hideLoading();
        if (result.success) {
          showSuccessModal(result.data || {
            id: "未知",
            productName: product.value.name,
            price: product.value.price
          });
        } else {
          common_vendor.index.showToast({
            title: result.message || "创建订单失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/detail/detail.vue:224", "创建订单失败:", error);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: ((_a = error.data) == null ? void 0 : _a.message) || "创建订单失败",
          icon: "none"
        });
      }
    };
    return {
      product,
      isLoading,
      createOrder,
      formatTime
      // 导出时间格式化函数
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $setup.isLoading
  }, $setup.isLoading ? {
    b: common_assets._imports_0$2
  } : {
    c: $setup.product.imageUrl,
    d: common_vendor.t($setup.product.name),
    e: common_vendor.t($setup.product.origin),
    f: common_vendor.t($setup.product.categoryName),
    g: common_vendor.t($setup.product.price || "知识无价"),
    h: $setup.product.imageUrl,
    i: common_vendor.t($setup.product.detail_desc),
    j: $setup.product.imageUrl,
    k: $setup.product.short_desc,
    l: common_vendor.o((...args) => $setup.createOrder && $setup.createOrder(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-eca06f3c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
