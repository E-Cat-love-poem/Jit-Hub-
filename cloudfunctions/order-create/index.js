// cloudfunctions/order-create/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const db = cloud.database()
  
  console.log('=== order-create 云函数被调用 ===')
  console.log('接收到的参数:', event)

  const { product_id, product_name, price } = event

  try {
    // 参数验证
    if (!product_id || !product_name || price === undefined) {
      return { 
        success: false, 
        message: '缺少必填参数' 
      }
    }

    // ✅ 修复：将 Long(price) 改为 Number(price)
    const newOrder = {
      id: Date.now(),  // 添加订单ID
      product_id: parseInt(product_id),
      product_name: product_name,
      price: Number(price),  // ✅ 核心修复：使用 Number()
      status: 0,
      create_time: new Date(),
      pay_time: null
    }

    console.log('准备插入的课程数据:', newOrder)

    const result = await db.collection('orders').add({
      data: newOrder
    })

    console.log('数据库插入成功:', result)

    return {
      success: true,
      message: '课程创建成功',
      data: newOrder
    }
  } catch (e) {
    console.error('云函数错误:', e)
    return { 
      success: false, 
      message: `创建失败: ${e.message}` 
    }
  }
}
