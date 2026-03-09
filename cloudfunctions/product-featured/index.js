const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async () => {
  const db = cloud.database()
  
  try {
    // 查询所有商品（不限制 status），并按创建时间倒序
    const result = await db.collection('product')
      .orderBy('createTime', 'desc')
      .limit(20) // 提高限制数量
      .get()

    console.log('product-featured 查询结果:', result.data.length, '条数据')
    
    return {
      code: 200,
      data: result.data,
      message: 'success'
    }
  } catch (e) {
    console.error('product-featured 错误:', e)
    return { code: 500, message: e.message, data: [] }
  }
}
