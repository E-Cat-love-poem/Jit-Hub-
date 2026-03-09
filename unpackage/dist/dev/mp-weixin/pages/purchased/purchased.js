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
          common_vendor.index.__f__("log", "at pages/purchased/purchased.vue:103", "已加载的课程进度:", savedProgress);
        }
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/purchased/purchased.vue:106", "加载进度失败:", e);
      }
    };
    const saveProgressToStorage = () => {
      try {
        common_vendor.index.setStorageSync("courseProgress", courseProgressStorage.value);
        common_vendor.index.__f__("log", "at pages/purchased/purchased.vue:114", "已保存课程进度:", courseProgressStorage.value);
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/purchased/purchased.vue:116", "保存进度失败:", e);
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
          common_vendor.index.__f__("log", "at pages/purchased/purchased.vue:173", "课程映射:", productsMap);
          common_vendor.index.__f__("log", "at pages/purchased/purchased.vue:174", "课程数据:", orders);
          purchasedList.value = orders.map((order) => {
            const courseName = order.product_name || order.productName || "未命名课程";
            const productInfo = productsMap[courseName] || null;
            let imageUrl = "/static/images/default-product.png";
            if (productInfo == null ? void 0 : productInfo.imageUrl) {
              let rawImageUrl = productInfo.imageUrl;
              if (!rawImageUrl.startsWith("http") && !rawImageUrl.startsWith("/")) {
                imageUrl = `/static/images/${rawImageUrl}`;
              } else {
                imageUrl = rawImageUrl;
              }
            }
            const progress = getCourseProgress(courseName);
            const teacherName = getTeacherName(courseName);
            return {
              id: order.id,
              name: courseName,
              // 显示的名称
              imageUrl,
              origin: "已购买",
              category: "我的课程",
              shortDesc: `已购买 · 点击查看详情`,
              price: order.price || 0,
              progress,
              productName: courseName,
              // ✅ 用于进度更新的关键字段
              teacherName
            };
          });
          common_vendor.index.__f__("log", "at pages/purchased/purchased.vue:211", "最终列表:", purchasedList.value);
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/purchased/purchased.vue:214", "加载失败:", err);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    };
    const getTeacherName = (courseName) => {
      if (courseName.includes("Java"))
        return "B站——Rosy-迷迭香";
      if (courseName.includes("Python"))
        return "Jit-Hub——韩霜";
      if (courseName.includes("大学英语四六级考试"))
        return "Jit-Hub——弗罗斯特";
      return "Jit-Hub——资深教师";
    };
    const startLearning = (item) => {
      common_vendor.index.__f__("log", "at pages/purchased/purchased.vue:231", "开始学习:", item);
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
      if (!courseName) {
        common_vendor.index.__f__("error", "at pages/purchased/purchased.vue:255", "courseName 为空:", item);
        common_vendor.index.showToast({ title: "课程信息错误", icon: "none" });
        return;
      }
      const currentProgress = getCourseProgress(courseName);
      if (currentProgress >= 100) {
        common_vendor.index.showToast({ title: "课程已完成", icon: "none" });
        return;
      }
      const newProgress = Math.min(currentProgress + 5, 100);
      updateCourseProgress(courseName, newProgress);
      purchasedList.value.forEach((order, index) => {
        if (order.productName === courseName) {
          purchasedList.value[index].progress = newProgress;
        }
      });
      common_vendor.index.showToast({
        title: `学习完成！进度+5% (${newProgress}%)`,
        icon: "success"
      });
      if (newProgress === 100) {
        setTimeout(() => {
          common_vendor.index.showModal({
            title: "🎉 恭喜！",
            content: `恭喜您已完成《${courseName}》课程的学习！`,
            showCancel: false
          });
        }, 1500);
      }
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
            d: common_vendor.t(item.progress),
            e: item.progress === 100
          }, item.progress === 100 ? {} : {}, {
            f: item.progress === 100 ? 1 : "",
            g: item.progress + "%",
            h: item.progress === 100 ? "#67C23A" : "linear-gradient(90deg, #409EFF, #66b1ff)",
            i: common_vendor.t(item.progress === 100 ? "已完成" : "立即学习"),
            j: item.progress === 100 ? 1 : "",
            k: common_vendor.o(($event) => startLearning(item), item.id),
            l: item.progress === 100,
            m: item.id
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
