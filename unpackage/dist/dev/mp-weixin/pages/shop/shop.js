"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  __name: "shop",
  setup(__props, { expose: __expose }) {
    const activeTab = common_vendor.ref("all");
    const loading = common_vendor.ref(false);
    const orderList = common_vendor.ref({
      all: [],
      unpaid: [],
      paid: []
    });
    common_vendor.onMounted(() => {
      refreshCurrentTab();
      loadInitialData();
    });
    const loadInitialData = async () => {
      try {
        loading.value = true;
        await fetchAllOrders();
      } catch (error) {
        showError("初始化数据失败", error);
      } finally {
        loading.value = false;
      }
    };
    const refreshCurrentTab = async () => {
      try {
        loading.value = true;
        if (activeTab.value === "all") {
          await fetchAllOrders();
        }
      } catch (error) {
        showError("刷新数据失败", error);
      } finally {
        loading.value = false;
      }
    };
    const changeTab = async (tabName) => {
      activeTab.value = tabName;
      await refreshCurrentTab();
    };
    const handlePay = async (orderId) => {
      try {
        loading.value = true;
        common_vendor.index.__f__("log", "at pages/shop/shop.vue:183", "支付订单:", orderId);
        const res = await utils_request.put(`/order/${orderId}/pay`, {});
        common_vendor.index.__f__("log", "at pages/shop/shop.vue:187", "支付响应:", res);
        if (!res.success) {
          throw new Error(res.message || "支付失败");
        }
        common_vendor.index.showToast({
          title: "支付成功",
          icon: "success"
        });
        const index = orderList.value.all.findIndex((item) => item.id == orderId);
        if (index !== -1) {
          orderList.value.all[index].status = 1;
          orderList.value.all[index].updateTime = (/* @__PURE__ */ new Date()).toISOString();
        }
        orderList.value.unpaid = orderList.value.unpaid.filter((item) => item.id != orderId);
        const paidOrder = orderList.value.all.find((item) => item.id == orderId);
        if (paidOrder && !orderList.value.paid.find((item) => item.id == orderId)) {
          orderList.value.paid.push(paidOrder);
          await refreshCurrentTab();
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/shop/shop.vue:218", "支付失败:", error);
        common_vendor.index.showToast({
          title: error.message || "支付失败",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    };
    const fetchAllOrders = async () => {
      try {
        const res = await utils_request.get("/order/all");
        if (res.success && res.data) {
          orderList.value.all = res.data;
          orderList.value.unpaid = res.data.filter((item) => item.status === 0);
          orderList.value.paid = res.data.filter((item) => item.status === 1);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/shop/shop.vue:241", "获取订单失败:", error);
      }
    };
    const showError = (defaultMsg, error) => {
      common_vendor.index.__f__("error", "at pages/shop/shop.vue:248", error);
      common_vendor.index.showToast({
        title: (error == null ? void 0 : error.message) || defaultMsg,
        icon: "none"
      });
    };
    __expose({
      activeTab,
      loading,
      orderList,
      changeTab,
      handlePay,
      refreshCurrentTab
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: activeTab.value === "all" ? 1 : "",
        b: common_vendor.o(($event) => changeTab("all")),
        c: activeTab.value === "unpaid" ? 1 : "",
        d: common_vendor.o(($event) => changeTab("unpaid")),
        e: activeTab.value === "paid" ? 1 : "",
        f: common_vendor.o(($event) => changeTab("paid")),
        g: activeTab.value === "all"
      }, activeTab.value === "all" ? common_vendor.e({
        h: common_vendor.f(orderList.value.all, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.id),
            b: common_vendor.t(item.createTime),
            c: common_vendor.t(item.productName),
            d: common_vendor.t(item.price),
            e: common_vendor.t(item.status === 0 ? "待付款" : "已付款"),
            f: common_vendor.n(item.status === 0 ? "unpaid" : "paid"),
            g: item.status === 0
          }, item.status === 0 ? {
            h: common_vendor.o(($event) => handlePay(item.id), item.id)
          } : {}, {
            i: item.id
          });
        }),
        i: loading.value
      }, loading.value ? {} : {}, {
        j: !loading.value && orderList.value.all.length === 0
      }, !loading.value && orderList.value.all.length === 0 ? {} : {}) : {}, {
        k: activeTab.value === "unpaid"
      }, activeTab.value === "unpaid" ? common_vendor.e({
        l: common_vendor.f(orderList.value.unpaid, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.productName),
            b: common_vendor.t(item.price),
            c: common_vendor.o(($event) => handlePay(item.id), item.id),
            d: item.id
          };
        }),
        m: loading.value
      }, loading.value ? {} : {}, {
        n: !loading.value && orderList.value.unpaid.length === 0
      }, !loading.value && orderList.value.unpaid.length === 0 ? {} : {}) : {}, {
        o: activeTab.value === "paid"
      }, activeTab.value === "paid" ? common_vendor.e({
        p: common_vendor.f(orderList.value.paid, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.productName),
            b: common_vendor.t(item.price),
            c: common_vendor.t(item.payTime),
            d: item.id
          };
        }),
        q: loading.value
      }, loading.value ? {} : {}, {
        r: !loading.value && orderList.value.paid.length === 0
      }, !loading.value && orderList.value.paid.length === 0 ? {} : {}) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2a6aaf81"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/shop/shop.js.map
