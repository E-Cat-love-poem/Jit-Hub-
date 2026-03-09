// cloudfunctions/product-detail/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const db = cloud.database()
  const { id } = event

  try {
    const result = await db.collection('product')
      .where({ id: parseInt(id) })
      .limit(1)
      .get()

    if (result.data.length === 0) {
      return { code: 404, message: '产品不存在' }
    }

    return {
      code: 200,
      data: result.data[0],
      message: 'success'
    }
  } catch (e) {
    return { code: 500, message: e.message }
  }
}
