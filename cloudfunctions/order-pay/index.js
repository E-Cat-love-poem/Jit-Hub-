// cloudfunctions/order-pay/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const db = cloud.database()
  const { orderId } = event  // 对应 @PathVariable Long orderId

  try {
    // 查找订单（对应 OrderServiceImpl.payOrder）
    const orderRes = await db.collection('orders')
      .where({ id: parseInt(orderId) })
      .limit(1)
      .get()

    if (orderRes.data.length === 0) {
      return { success: false, message: '课程不存在' }
    }

    const order = orderRes.data[0]
    if (order.status !== 0) {
      return { success: false, message: '课程确认失败或课程不存在' }
    }

    // 更新订单状态
    await db.collection('orders')
      .where({ id: parseInt(orderId) })
      .update({
        data: {
          status: 1,  // 1已支付
          pay_time: new Date()
        }
      })

    return {
      success: true,
      message: '课程确认成功',
      orderId: parseInt(orderId)
    }
  } catch (e) {
    return { success: false, message: e.message }
  }
}
