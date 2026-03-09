// cloudfunctions/product-add/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const db = cloud.database()
  
  try {
    // 参数验证
    if (!event.name || !event.categoryId) {
      console.error('参数错误：name 或 categoryId 缺失')
      return { code: 400, message: '参数错误：name 或 categoryId 缺失' }
    }

    // 转换数据类型（与 Java 实体完全一致）
    const productData = {
      id: event.id || Date.now(),
      name: event.name,
      origin: event.origin || '',
      categoryId: parseInt(event.categoryId) || 0,
      categoryName: event.categoryName || '',
      imageUrl: event.imageUrl || '',
      shortDesc: event.shortDesc || '',
      detailDesc: event.detailDesc || '',
      price: parseFloat(event.price) || 0,
      status: event.status || 1,
      createTime: event.createTime ? new Date(event.createTime) : new Date(),
      updateTime: event.updateTime ? new Date(event.updateTime) : new Date()
    }

    console.log('准备插入的数据:', productData)

    // 写入数据库
    const result = await db.collection('product').add({
      data: productData
    })

    console.log('数据库插入成功:', result)

    return {
      code: 200,
      data: { _id: result._id, ...productData },
      message: 'success'
    }
  } catch (e) {
    console.error('云函数执行错误:', e)
    return { code: 500, message: e.message || '数据库插入失败' }
  }
}
