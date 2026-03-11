// utils/request.js
const baseURL = 'http://localhost:8088';

const request = (options) => {
  return new Promise((resolve, reject) => {
    // 使用 uni.request 而不是 wx.request
    uni.request({
      url: baseURL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': uni.getStorageSync('token') || ''  // uni-app使用uni.getStorageSync
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          // uni-app 的提示方式
          uni.showToast({ 
            title: res.data?.message || `请求失败[${res.statusCode}]`, 
            icon: 'none' 
          });
          reject(res.data);
        }
      },
      fail: (err) => {
        uni.showToast({ 
          title: err.errMsg || '网络错误', 
          icon: 'none' 
        });
        reject(err);
      }
    });
  });
};

// 方法1：命名导出（推荐）
export const get = (url, data) => request({ url, method: 'GET', data });
export const post = (url, data) => request({ url, method: 'POST', data });
export const put = (url, data) => request({ url, method: 'PUT', data });

// 方法2：默认导出（两种写法都可以）
// 写法1：导出包含方法的对象
// export default { get, post, put };

// 写法2：导出函数对象
//export default request;