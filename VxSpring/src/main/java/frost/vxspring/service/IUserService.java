package frost.vxspring.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.IService;
import frost.vxspring.pojo.User;


public interface IUserService {
    boolean register(User user);
    User login(String account, String password);
    User getUserById(Long userId);
}