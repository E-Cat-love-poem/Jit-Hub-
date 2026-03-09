// cloudfunctions/product-search/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const db = cloud.database()
  const { keyword } = event

  if (!keyword) {
    return { code: 400, message: 'keyword不能为空' }
  }

  try {
    const result = await db.collection('product')
      .where(
        db.command.or(
          { name: db.RegExp({ regexp: keyword, options: 'i' }) },
          { shortDesc: db.RegExp({ regexp: keyword, options: 'i' }) },
          { detailDesc: db.RegExp({ regexp: keyword, options: 'i' }) }
        )
      )
      .where({ status: 1 })
      .orderBy('createTime', 'desc')
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
