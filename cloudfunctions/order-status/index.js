// cloudfunctions/order-status/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const db = cloud.database()
  const { status } = event  // 对应 @PathVariable Integer status

  try {
    const result = await db.collection('orders')
      .where({ status: parseInt(status) })
      .orderBy('create_time', 'desc')
      .get()

    return {
      success: true,
      message: '根据状态获取订单成功',
      data: result.data
    }
  } catch (e) {
    return { success: false, message: e.message, data: [] }
  }
}
