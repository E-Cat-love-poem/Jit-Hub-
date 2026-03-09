// cloudfunctions/user-info/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const db = cloud.database()
  const { userId } = event  // 对应 @RequestParam Long userId

  try {
    const result = await db.collection('wx_user')
      .where({ user_id: parseInt(userId) })
      .limit(1)
      .get()

    if (result.data.length === 0) {
      return { code: 404, message: '用户不存在' }
    }

    // 返回完整 User 对象（字段与 Java POJO 一致）
    const user = result.data[0]
    return {
      userId: user.user_id,
      userName: user.user_name,
      password: user.password,  // 注意安全：实际不应返回密码
      email: user.email
    }
  } catch (e) {
    return { code: 500, message: e.message }
  }
}
