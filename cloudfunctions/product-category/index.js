// cloudfunctions/product-featured/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async () => {
  const db = cloud.database()
  
  try {
    const result = await db.collection('product')
      .where({ status: 1 })
      .orderBy('createTime', 'desc')
      .limit(6)
      .get()

    return {
      code: 200,
      data: result.data,
      message: 'success'
    }
  } catch (e) {
    return { code: 500, message: e.message }
  }
}
