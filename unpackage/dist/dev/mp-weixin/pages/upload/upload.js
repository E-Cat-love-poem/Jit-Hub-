"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      courseForm: {
        name: "",
        origin: "",
        category_id: "",
        category_name: "",
        image_url: "",
        short_desc: "",
        detail_desc: "",
        price: "1",
        status: 1,
        // 默认上架
        create_time: "",
        update_time: ""
      },
      isSubmitting: false
    };
  },
  onLoad(options) {
    common_vendor.index.__f__("log", "at pages/upload/upload.vue:137", "页面加载", options);
  },
  onShow() {
    common_vendor.index.__f__("log", "at pages/upload/upload.vue:141", "页面显示");
  },
  methods: {
    // 设置课程状态
    setStatus(status) {
      this.courseForm.status = status;
    },
    // 重置表单（有弹窗确认，用于手动点击重置按钮）
    resetForm() {
      common_vendor.index.showModal({
        title: "确认重置",
        content: "确定要重置所有表单内容吗？",
        success: (res) => {
          if (res.confirm) {
            this.courseForm = {
              name: "",
              origin: "",
              category_id: "",
              category_name: "",
              image_url: "",
              short_desc: "",
              detail_desc: "",
              price: "",
              status: 1,
              create_time: "",
              update_time: ""
            };
            common_vendor.index.showToast({
              title: "已重置",
              icon: "success"
            });
          }
        }
      });
    },
    // 提交成功后清空表单（无弹窗）
    clearFormAfterSubmit() {
      this.courseForm = {
        name: "",
        origin: "",
        category_id: "",
        category_name: "",
        image_url: "",
        short_desc: "",
        detail_desc: "",
        price: "",
        status: 1,
        create_time: "",
        update_time: ""
      };
    },
    // 验证表单
    validateForm() {
      const requiredFields = [
        "name",
        "origin",
        "category_id",
        "category_name",
        "price",
        "short_desc"
      ];
      for (const field of requiredFields) {
        if (!this.courseForm[field] || this.courseForm[field].toString().trim() === "") {
          common_vendor.index.showToast({
            title: `请填写${this.getFieldName(field)}`,
            icon: "none"
          });
          return false;
        }
      }
      if (isNaN(parseInt(this.courseForm.category_id))) {
        common_vendor.index.showToast({
          title: "分类ID必须是数字",
          icon: "none"
        });
        return false;
      }
      return true;
    },
    // 获取字段中文名称
    getFieldName(field) {
      const fieldNames = {
        name: "课程名称",
        origin: "产地/来源",
        category_id: "分类ID",
        category_name: "分类名称",
        price: "价格",
        short_desc: "简短描述"
      };
      return fieldNames[field] || field;
    },
    // 提交课程
    async submitCourse() {
      if (!this.validateForm()) {
        return;
      }
      this.isSubmitting = true;
      try {
        const now = (/* @__PURE__ */ new Date()).toISOString();
        const formData = {
          name: this.courseForm.name,
          origin: this.courseForm.origin,
          categoryId: parseInt(this.courseForm.category_id),
          categoryName: this.courseForm.category_name,
          price: parseFloat(this.courseForm.price),
          imageUrl: this.courseForm.image_url,
          shortDesc: this.courseForm.short_desc,
          detailDesc: this.courseForm.detail_desc,
          status: this.courseForm.status,
          createTime: now,
          updateTime: now
        };
        common_vendor.index.__f__("log", "at pages/upload/upload.vue:266", "提交的数据（驼峰格式）:", formData);
        const result = await utils_request.post("/product/add", formData);
        common_vendor.index.__f__("log", "at pages/upload/upload.vue:271", "提交课程响应:", result);
        common_vendor.index.__f__("log", "at pages/upload/upload.vue:274", "=== 响应验证 ===", result);
        common_vendor.index.__f__("log", "at pages/upload/upload.vue:275", "是否有_id:", !!result._id);
        common_vendor.index.__f__("log", "at pages/upload/upload.vue:276", "是否有id:", !!result.id);
        if (result && (result.code === 200 || result._id)) {
          common_vendor.index.showToast({
            title: "课程上传成功！",
            icon: "success",
            duration: 2e3
          });
          this.clearFormAfterSubmit();
        } else {
          throw new Error((result == null ? void 0 : result.message) || `上传失败: ${JSON.stringify(result)}`);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/upload/upload.vue:294", "上传失败:", error);
        common_vendor.index.showToast({
          title: error.message || "上传失败，请重试",
          icon: "error"
        });
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0,
    b: $data.courseForm.name,
    c: common_vendor.o(($event) => $data.courseForm.name = $event.detail.value),
    d: $data.courseForm.origin,
    e: common_vendor.o(($event) => $data.courseForm.origin = $event.detail.value),
    f: $data.courseForm.category_id,
    g: common_vendor.o(($event) => $data.courseForm.category_id = $event.detail.value),
    h: $data.courseForm.category_name,
    i: common_vendor.o(($event) => $data.courseForm.category_name = $event.detail.value),
    j: $data.courseForm.image_url,
    k: common_vendor.o(($event) => $data.courseForm.image_url = $event.detail.value),
    l: $data.courseForm.short_desc,
    m: common_vendor.o(($event) => $data.courseForm.short_desc = $event.detail.value),
    n: common_vendor.t($data.courseForm.short_desc.length),
    o: $data.courseForm.detail_desc,
    p: common_vendor.o(($event) => $data.courseForm.detail_desc = $event.detail.value),
    q: common_vendor.t($data.courseForm.detail_desc.length),
    r: common_vendor.t($data.courseForm.status === 1 ? "✓" : "○"),
    s: common_vendor.o(($event) => $options.setStatus(1)),
    t: common_vendor.t($data.courseForm.status === 0 ? "✓" : "○"),
    v: common_vendor.o(($event) => $options.setStatus(0)),
    w: common_vendor.o((...args) => $options.resetForm && $options.resetForm(...args)),
    x: common_vendor.t($data.isSubmitting ? "提交中..." : "提交课程"),
    y: common_vendor.o((...args) => $options.submitCourse && $options.submitCourse(...args)),
    z: $data.isSubmitting
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-aa5cff34"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/upload/upload.js.map
