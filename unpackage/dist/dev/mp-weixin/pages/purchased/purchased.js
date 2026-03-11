"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  __name: "purchased",
  setup(__props) {
    const purchasedList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const courseProgressMap = {
      "Java": 45,
      "Python": 30,
      "其他": 0
    };
    const courseTeacherNameMap = {
      "Java": "B站——一只宕机了的猫",
      "Python": "Jit-Hub——韩霜"
    };
    const courseProgressStorage = common_vendor.ref({});
    common_vendor.onMounted(() => {
      loadProgressFromStorage();
      loadPurchasedProducts();
    });
    const loadProgressFromStorage = () => {
      try {
        const savedProgress = common_vendor.index.getStorageSync("courseProgress");
        if (savedProgress) {
          courseProgressStorage.value = savedProgress;
          common_vendor.index.__f__("log", "at pages/purchased/purchased.vue:101", "已加载的课程进度:", savedProgress);
        }
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/purchased/purchased.vue:104", "加载进度失败:", e);
      }
    };
    const saveProgressToStorage = () => {
      try {
        common_vendor.index.setStorageSync("courseProgress", courseProgressStorage.value);
        common_vendor.index.__f__("log", "at pages/purchased/purchased.vue:112", "已保存课程进度:", courseProgressStorage.value);
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/purchased/purchased.vue:114", "保存进度失败:", e);
      }
    };
    const getCourseProgress = (courseName) => {
      if (!courseName)
        return 0;
      if (courseProgressStorage.value[courseName] !== void 0) {
        return courseProgressStorage.value[courseName];
      }
      if (courseName.includes("Java")) {
        return courseProgressMap["Java"];
      } else if (courseName.includes("Python")) {
        return courseProgressMap["Python"];
      } else {
        return courseProgressMap["其他"];
      }
    };
    const updateCourseProgress = (courseName, progress) => {
      if (!courseName)
        return;
      courseProgressStorage.value[courseName] = progress;
      purchasedList.value.forEach((item, index) => {
        if (item.productName === courseName) {
          purchasedList.value[index].progress = progress;
        }
      });
      saveProgressToStorage();
    };
    const loadPurchasedProducts = async () => {
      loading.value = true;
      try {
        const ordersRes = await utils_request.get("/order/all");
        if (ordersRes.success && ordersRes.data) {
          const orders = ordersRes.data.filter((item) => item.status === 1);
          const productsRes = await utils_request.get("/product/featured");
          const productsMap = {};
          productsRes.forEach((product) => {
            productsMap[product.name] = product;
          });
          const courseCount = {};
          orders.forEach((order) => {
            const courseName = order.productName;
            if (courseName) {
              courseCount[courseName] = (courseCount[courseName] || 0) + 1;
            }
          });
          purchasedList.value = orders.map((order) => {
            let productInfo = null;
            if (order.productName && productsMap[order.productName]) {
              productInfo = productsMap[order.productName];
            }
            let imageUrl = "/static/images/default-product.png";
            if (productInfo && productInfo.imageUrl) {
              let rawImageUrl = productInfo.imageUrl;
              if (rawImageUrl && !rawImageUrl.startsWith("http") && !rawImageUrl.startsWith("/")) {
                imageUrl = `/static/images/${rawImageUrl}`;
              } else if (rawImageUrl.includes("localhost:8090") || rawImageUrl.includes("localhost")) {
                const filename = rawImageUrl.split("/").pop();
                imageUrl = `/static/images/${filename}`;
              } else if (rawImageUrl) {
                imageUrl = rawImageUrl;
              }
            }
            let progress = 0;
            let teacherName = "";
            if (order.productName) {
              progress = getCourseProgress(order.productName);
              if (order.productName.includes("Java")) {
                teacherName = courseTeacherNameMap["Java"];
              } else if (order.productName.includes("Python")) {
                teacherName = courseTeacherNameMap["Python"];
              } else {
                teacherName = "资深教师";
              }
            }
            const buyCount = courseCount[order.productName] || 1;
            return {
              id: order.id,
              name: order.productName || "未命名课程",
              imageUrl,
              origin: "已购买",
              category: productInfo ? productInfo.categoryName || productInfo.category || "我的课程" : "我的课程",
              shortDesc: productInfo ? productInfo.description ? productInfo.description.substring(0, 30) + "..." : `已购买${buyCount}次` : `已购买${buyCount}次 · 点击查看详情`,
              price: order.price || 0,
              progress,
              productName: order.productName,
              teacherName
            };
          });
          common_vendor.index.__f__("log", "at pages/purchased/purchased.vue:235", "已购买商品列表:", purchasedList.value);
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/purchased/purchased.vue:238", "加载已购商品失败:", err);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    };
    const startLearning = (item) => {
      common_vendor.index.__f__("log", "at pages/purchased/purchased.vue:249", "开始学习:", item);
      common_vendor.index.showModal({
        title: "开始学习",
        content: `确定开始学习《${item.name}》吗？
学习后该课程所有记录进度将增加5%`,
        showCancel: true,
        cancelText: "取消",
        confirmText: "开始学习",
        success: (res) => {
          if (res.confirm) {
            increaseProgress(item);
          }
        }
      });
    };
    const increaseProgress = (item) => {
      const courseName = item.productName;
      if (!courseName)
        return;
      const currentProgress = getCourseProgress(courseName);
      if (currentProgress >= 100)
        return;
      const newProgress = Math.min(currentProgress + 5, 100);
      updateCourseProgress(courseName, newProgress);
      common_vendor.index.showToast({
        title: `学习完成！进度+5% (${newProgress}%)`,
        icon: "success",
        duration: 2e3
      });
      if (newProgress === 100) {
        setTimeout(() => {
          common_vendor.index.showModal({
            title: "🎉 恭喜！",
            content: `恭喜您已完成《${item.name}》课程的学习！`,
            showCancel: false,
            confirmText: "太棒了！"
          });
        }, 1500);
      }
      common_vendor.index.__f__("log", "at pages/purchased/purchased.vue:304", `课程 ${courseName} 进度更新: ${currentProgress}% -> ${newProgress}%`);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !loading.value && purchasedList.value.length > 0
      }, !loading.value && purchasedList.value.length > 0 ? {
        b: common_vendor.f(purchasedList.value, (item, k0, i0) => {
          return common_vendor.e({
            a: item.imageUrl,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.teacherName),
            d: common_vendor.t(item.shortDesc),
            e: common_vendor.t(item.progress),
            f: item.progress === 100
          }, item.progress === 100 ? {} : {}, {
            g: item.progress === 100 ? 1 : "",
            h: item.progress + "%",
            i: item.progress === 100 ? "#67C23A" : "linear-gradient(90deg, #409EFF, #66b1ff)",
            j: common_vendor.t(item.price),
            k: common_vendor.t(item.progress === 100 ? "已完成" : "立即学习"),
            l: item.progress === 100 ? 1 : "",
            m: common_vendor.o(($event) => startLearning(item), item.id),
            n: item.progress === 100,
            o: item.id
          });
        })
      } : {}, {
        c: loading.value
      }, loading.value ? {} : {}, {
        d: !loading.value && purchasedList.value.length === 0
      }, !loading.value && purchasedList.value.length === 0 ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a8e27f3a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/purchased/purchased.js.map
