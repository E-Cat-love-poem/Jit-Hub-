"use strict";
const common_vendor = require("../../common/vendor.js");
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
        price: "",
        status: 1,
        // 默认上架
        create_time: "",
        update_time: ""
      },
      isSubmitting: false
    };
  },
  onLoad(options) {
    common_vendor.index.__f__("log", "at pages/upload/upload.vue:146", "页面加载", options);
  },
  onShow() {
    common_vendor.index.__f__("log", "at pages/upload/upload.vue:150", "页面显示");
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
      if (isNaN(parseFloat(this.courseForm.price)) || parseFloat(this.courseForm.price) <= 0) {
        common_vendor.index.showToast({
          title: "请输入有效的价格",
          icon: "none"
        });
        return false;
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
          // 注意：驼峰
          categoryName: this.courseForm.category_name,
          // 注意：驼峰
          price: parseFloat(this.courseForm.price),
          imageUrl: this.courseForm.image_url,
          // 注意：驼峰
          shortDesc: this.courseForm.short_desc,
          // 注意：驼峰
          detailDesc: this.courseForm.detail_desc,
          // 注意：驼峰
          status: this.courseForm.status,
          createTime: now,
          // 注意：驼峰
          updateTime: now
          // 注意：驼峰
        };
        common_vendor.index.__f__("log", "at pages/upload/upload.vue:282", "提交的数据（驼峰格式）:", formData);
        const result = await common_vendor.index.request({
          url: "http://localhost:8088/product/add",
          method: "POST",
          data: formData,
          header: {
            "Content-Type": "application/json"
          }
        });
        common_vendor.index.__f__("log", "at pages/upload/upload.vue:294", "提交课程响应:", result);
        if (result.statusCode === 200 && result.data === true) {
          common_vendor.index.showToast({
            title: "课程上传成功！",
            icon: "success",
            duration: 2e3
          });
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
        } else {
          throw new Error("上传失败");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/upload/upload.vue:322", "上传失败:", error);
        common_vendor.index.showToast({
          title: "上传失败，请重试",
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
    j: $data.courseForm.price,
    k: common_vendor.o(($event) => $data.courseForm.price = $event.detail.value),
    l: $data.courseForm.image_url,
    m: common_vendor.o(($event) => $data.courseForm.image_url = $event.detail.value),
    n: $data.courseForm.short_desc,
    o: common_vendor.o(($event) => $data.courseForm.short_desc = $event.detail.value),
    p: common_vendor.t($data.courseForm.short_desc.length),
    q: $data.courseForm.detail_desc,
    r: common_vendor.o(($event) => $data.courseForm.detail_desc = $event.detail.value),
    s: common_vendor.t($data.courseForm.detail_desc.length),
    t: common_vendor.t($data.courseForm.status === 1 ? "✓" : "○"),
    v: common_vendor.o(($event) => $options.setStatus(1)),
    w: common_vendor.t($data.courseForm.status === 0 ? "✓" : "○"),
    x: common_vendor.o(($event) => $options.setStatus(0)),
    y: common_vendor.o((...args) => $options.resetForm && $options.resetForm(...args)),
    z: common_vendor.t($data.isSubmitting ? "提交中..." : "提交课程"),
    A: common_vendor.o((...args) => $options.submitCourse && $options.submitCourse(...args)),
    B: $data.isSubmitting
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-aa5cff34"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/upload/upload.js.map
