// cloudfunctions/user-register/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const db = cloud.database()
  const { user_name, password, email } = event  // 严格对应 Java 字段

  try {
    // 检查用户名或邮箱是否已存在（对应 UserServiceImpl.register 逻辑）
    const existing = await db.collection('wx_user')
      .where(
        db.command.or(
          { user_name: user_name },
          { email: email }
        )
      )
      .count()

    if (existing.total > 0) {
      return {
        success: false,
        message: '用户名或邮箱已存在'
      }
    }

    // 插入新用户（user_id 由前端生成或自增）
    const newUser = {
      user_id: Date.now(),  // 模拟自增 ID
      user_name,
      password,  // 实际项目中应加密存储
      email,
      create_time: new Date()
    }

    await db.collection('wx_user').add({ data: newUser })

    return {
      success: true,
      message: '注册成功'
    }
  } catch (e) {
    return { success: false, message: e.message }
  }
}
