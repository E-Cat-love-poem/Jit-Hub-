// cloudfunctions/user-login/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const db = cloud.database()
  const { account, password } = event  // 对应 Map<String, String> params

  try {
    // 查询用户（匹配 UserServiceImpl.login 的 SQL 逻辑）
    const result = await db.collection('wx_user')
      .where({
        user_name: account,
        password: password  // 实际应使用加密密码比对
      })
      .limit(1)
      .get()

    if (result.data.length === 0) {
      return {
        success: false,
        message: '登录失败',
        userInfo: null
      }
    }

    const user = result.data[0]
    return {
      success: true,
      message: `登录成功:${user.user_name}`,
      userInfo: {
        user_id: user.user_id,
        user_name: user.user_name,
        email: user.email
      }
    }
  } catch (e) {
    return { success: false, message: e.message, userInfo: null }
  }
}
