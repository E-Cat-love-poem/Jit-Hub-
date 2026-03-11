"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  __name: "Home",
  setup(__props) {
    const searchText = common_vendor.ref("");
    const showSearchResults = common_vendor.ref(false);
    const isLoading = common_vendor.ref(false);
    const banners = common_vendor.ref([
      "/static/images/banner1.png",
      "/static/images/banner2.png",
      "/static/images/banner3.png",
      "/static/images/banner4.png",
      "/static/images/banner5.png"
    ]);
    const featuredCrafts = common_vendor.ref([]);
    const searchResults = common_vendor.ref([]);
    const masters = common_vendor.ref([
      {
        id: 1,
        name: "Jit-Hub——韩霜",
        avatar: "/static/avatars/user-avatar.jpg",
        skill: "Python爬虫",
        title: "Jit-Hub负责人"
      },
      {
        id: 2,
        name: "Jit-Hub——弗罗斯特",
        avatar: "/static/avatars/avatar1.png",
        skill: "英语教学",
        title: "英文趣味教学者"
      },
      {
        id: 3,
        name: "B站——一只宕机了的猫",
        avatar: "/static/avatars/avatar2.png",
        skill: "Java后端攻略",
        title: "一只了解前后段代码的猫"
      }
    ]);
    common_vendor.onMounted(() => {
      loadFeaturedProducts();
    });
    common_vendor.onLoad(() => {
      common_vendor.index.__f__("log", "at pages/Home/Home.vue:194", "Home页面加载");
      loadFeaturedProducts();
    });
    common_vendor.onShow(() => {
      common_vendor.index.__f__("log", "at pages/Home/Home.vue:198", "Home页面显示，刷新数据");
      loadFeaturedProducts();
    });
    const loadFeaturedProducts = async () => {
      isLoading.value = true;
      try {
        const res = await utils_request.get("/product/featured");
        featuredCrafts.value = res.map((item) => {
          let imageUrl = item.imageUrl || "";
          if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {
            imageUrl = `/static/images/${imageUrl}`;
          } else if (imageUrl.includes("localhost:8090") || imageUrl.includes("localhost")) {
            const filename = imageUrl.split("/").pop();
            imageUrl = `/static/images/${filename}`;
          }
          if (!imageUrl || imageUrl === "null" || imageUrl === "undefined") {
            imageUrl = "/static/images/default-product.png";
          }
          return {
            id: item.id,
            name: item.name,
            imageUrl,
            origin: item.origin,
            category: item.categoryName || item.category,
            shortDesc: item.description ? item.description.substring(0, 30) + "..." : "点击了解更多",
            price: item.price || 0,
            detailDesc: item.detailDesc || ""
          };
        });
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/Home/Home.vue:241", "加载特色商品失败:", err);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        isLoading.value = false;
      }
    };
    const onInputChange = (e) => {
      searchText.value = e.detail ? e.detail.value : e.target.value;
    };
    const onSearch = async () => {
      if (!searchText.value.trim()) {
        common_vendor.index.showToast({
          title: "请输入搜索内容",
          icon: "none"
        });
        return;
      }
      isLoading.value = true;
      try {
        const products = await utils_request.get("/product/search", {
          keyword: searchText.value
        });
        common_vendor.index.__f__("log", "at pages/Home/Home.vue:273", "搜索结果:", products);
        searchResults.value = products.map((item) => {
          let imageUrl = item.imageUrl || "";
          if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {
            imageUrl = `/static/images/${imageUrl}`;
          } else if (imageUrl.includes("localhost:8090") || imageUrl.includes("localhost")) {
            const filename = imageUrl.split("/").pop();
            imageUrl = `/static/images/${filename}`;
          }
          if (!imageUrl || imageUrl === "null" || imageUrl === "undefined") {
            imageUrl = "/static/images/default-product.png";
          }
          return {
            id: item.id,
            name: item.name,
            imageUrl,
            // 使用处理后的图片URL
            origin: item.origin,
            price: item.price
          };
        });
        showSearchResults.value = true;
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/Home/Home.vue:308", "搜索失败:", err);
        common_vendor.index.showToast({
          title: "搜索失败",
          icon: "none"
        });
      } finally {
        isLoading.value = false;
      }
    };
    const closeSearchResults = () => {
      showSearchResults.value = false;
      searchText.value = "";
    };
    const goToPage = (pageType) => {
      switch (pageType) {
        case "chat":
          common_vendor.index.navigateTo({
            url: "/pages/chat/chat",
            fail: () => {
              showErrorModal("聊天室功能开发中");
            }
          });
          break;
        case "ai":
          common_vendor.index.navigateTo({
            url: "/pages/ai/ai",
            fail: () => {
              showErrorModal("AI解答功能开发中");
            }
          });
          break;
        case "course":
          common_vendor.index.navigateTo({
            url: "/pages/purchased/purchased",
            fail: () => {
              showErrorModal("课程管理功能开发中");
            }
          });
          break;
        case "exam":
          common_vendor.index.navigateTo({
            url: "/pages/exam/exam",
            fail: () => {
              showErrorModal("在线测试功能开发中");
            }
          });
          break;
        default:
          showErrorModal("该功能即将上线");
      }
    };
    const goToDetail = (id) => {
      if (!id) {
        common_vendor.index.showToast({
          title: "商品ID无效",
          icon: "none"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail?id=${id}`
      });
    };
    const goToAllProducts = () => {
      common_vendor.index.navigateTo({
        url: "/pages/products/products",
        fail: () => {
          showErrorModal("商品列表功能开发中");
        }
      });
    };
    const goToMasterDetail = (id) => {
      common_vendor.index.navigateTo({
        url: `/pages/master/master?id=${id}`,
        fail: () => {
          showErrorModal("教师详情功能开发中");
        }
      });
    };
    const goToAllTeachers = () => {
      common_vendor.index.navigateTo({
        url: "/pages/teachers/teachers",
        fail: () => {
          showErrorModal("教师列表功能开发中");
        }
      });
    };
    const onSearchItemTap = (id) => {
      if (!id) {
        common_vendor.index.showToast({
          title: "商品ID无效",
          icon: "none"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail?id=${id}`
      });
    };
    const showErrorModal = (message = "功能正在开发中，敬请期待") => {
      common_vendor.index.showModal({
        title: "提示",
        content: message,
        showCancel: false,
        confirmText: "我知道了",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.__f__("log", "at pages/Home/Home.vue:441", "用户点击了我知道了");
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(onSearch),
        b: common_vendor.o([($event) => searchText.value = $event.detail.value, onInputChange]),
        c: searchText.value,
        d: common_vendor.o(onSearch),
        e: showSearchResults.value
      }, showSearchResults.value ? {
        f: common_vendor.o(closeSearchResults),
        g: common_vendor.f(searchResults.value, (item, k0, i0) => {
          return {
            a: item.imageUrl,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.origin),
            d: common_vendor.t(item.price),
            e: item.id,
            f: common_vendor.o(($event) => onSearchItemTap(item.id), item.id)
          };
        })
      } : {}, {
        h: common_vendor.f(banners.value, (item, index, i0) => {
          return {
            a: item,
            b: index
          };
        }),
        i: common_assets._imports_0$1,
        j: common_vendor.o(($event) => goToPage("chat")),
        k: common_assets._imports_1,
        l: common_vendor.o(($event) => goToPage("ai")),
        m: common_assets._imports_2,
        n: common_vendor.o(($event) => goToPage("course")),
        o: common_assets._imports_3,
        p: common_vendor.o(($event) => goToPage("exam")),
        q: common_vendor.o(goToAllProducts),
        r: common_vendor.f(featuredCrafts.value, (item, k0, i0) => {
          return {
            a: item.imageUrl,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.origin),
            d: common_vendor.t(item.category),
            e: common_vendor.t(item.shortDesc),
            f: common_vendor.t(item.price),
            g: item.id,
            h: common_vendor.o(($event) => goToDetail(item.id), item.id)
          };
        }),
        s: common_vendor.o(goToAllTeachers),
        t: common_vendor.f(masters.value, (item, k0, i0) => {
          return {
            a: item.avatar,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.skill),
            d: common_vendor.t(item.title),
            e: item.id,
            f: common_vendor.o(($event) => goToMasterDetail(item.id), item.id)
          };
        }),
        v: isLoading.value
      }, isLoading.value ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7ffebbf4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Home/Home.js.map
