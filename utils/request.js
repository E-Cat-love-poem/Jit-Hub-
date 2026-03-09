// ==================== 配置区（仅需修改这里） ====================
const USE_CLOUD = true;          // 切换开关：true=云开发，false=Spring Boot
const CLOUD_ENV = 'cloud1-0gpacbi01728ba35'; // 替换为您的云环境ID

// 自动映射规则：key 是请求路径前缀，value 是云函数前缀
// 例如 /product/add 会被转换为调用云函数 product-add
const CLOUD_FUNCTION_MAP = {
  '/product': 'product',
  '/user': 'user',  
  '/order': 'order'
};
// =================================================================

// 云函数调用封装
async function callCloudFunction(functionName, data = {}) {
  try {
    // 初始化云开发（只需一次）
    try {
      wx.cloud.init({
        env: CLOUD_ENV,
        traceUser: true
      });
    } catch (e) {}
    
    const res = await wx.cloud.callFunction({
      name: functionName,
      data: data
    });
    
    // 适配云函数返回格式到原有 HTTP 格式
    const cloudResult = res.result;
    if (cloudResult && typeof cloudResult === 'object' && 'code' in cloudResult) {
      // 如果云函数返回 {code, data, message}
      if (cloudResult.code === 200) {
        return cloudResult.data;
      } else {
        throw { message: cloudResult.message, code: cloudResult.code };
      }
    }
    // 如果返回其他格式，直接返回
    return cloudResult;
    
  } catch (error) {
    throw {
      message: error.message || '云函数调用失败',
      code: error.code || 500
    };
  }
}

// 智能解析云函数名称
function getCloudFunctionName(url) {
  const path = url.split('?')[0]; // 移除查询参数
  for (const [prefix, funcPrefix] of Object.entries(CLOUD_FUNCTION_MAP)) {
    if (path.startsWith(prefix)) {
      const action = path.substring(prefix.length + 1); // +1 移除 '/'
      return `${funcPrefix}-${action}`;
    }
  }
  return path.substring(1).replace(/\//g, '-'); // 默认规则
}

// 主请求函数（保持原有签名不变）
const request = (options) => {
  return new Promise((resolve, reject) => {
    // 如果启用云开发，走云函数调用
    if (USE_CLOUD) {
      const functionName = options.cloudFunction || getCloudFunctionName(options.url);
      
      callCloudFunction(functionName, options.data)
        .then(resolve)
        .catch(err => {
          uni.showToast({ title: err.message, icon: 'none' });
          reject(err);
        });
      return;
    }
    
    // 这里是原来的 HTTP 请求代码（Spring Boot），需要补上
    // 由于你删除了这部分代码，但 Promise 需要结束
    reject(new Error('Spring Boot 模式未配置'));
  });
}

// 保持原有导出不变！其他文件无需修改
export const get = (url, data) => request({ url, method: 'GET', data });
export const post = (url, data) => request({ url, method: 'POST', data });
export const put = (url, data) => request({ url, method: 'PUT', data });

// 新增：特殊情况下手动指定云函数名
export const callFunction = (name, data) => callCloudFunction(name, data);

export default request;