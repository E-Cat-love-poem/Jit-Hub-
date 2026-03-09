package frost.vxspring.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import frost.vxspring.mapper.UserMapper;
import frost.vxspring.pojo.User;

import frost.vxspring.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class UserServiceImpl implements IUserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public boolean register(User user) {
        // 检查用户名和邮箱是否已存在
        QueryWrapper<User> wrapper = new QueryWrapper<>();
        wrapper.eq("user_name", user.getUserName())
                .or()
                .eq("email", user.getEmail());
        if (userMapper.selectCount(wrapper) > 0) {
            return false;
        }
        return userMapper.insert(user) > 0;
    }

    @Override
    public User login(String account, String password) {
        // 直接返回Mapper查询结果（SQL已包含密码验证）
        return userMapper.selectForLogin(account, password);
    }

    @Override
    public User getUserById(Long userId) {
        return userMapper.selectById(userId);
    }
}