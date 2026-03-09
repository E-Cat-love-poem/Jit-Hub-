// cloudfunctions/order-all/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async () => {
  const db = cloud.database()

  try {
    const result = await db.collection('orders')
      .orderBy('create_time', 'desc')
      .get()

    return {
      success: true,
      message: '获取课程列表成功',
      data: result.data
    }
  } catch (e) {
    return { success: false, message: e.message, data: [] }
  }
}
