package frost.vxspring.controller;

import frost.vxspring.pojo.User;
import frost.vxspring.service.IUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private IUserService userService;

    // 注册接口
    @PostMapping("/register")
    @ResponseBody // 确保返回JSON
    public Map<String, Object> register(@RequestBody User user) {
        Map<String, Object> result = new HashMap<>();
        boolean isSuccess = userService.register(user);
        result.put("success", isSuccess);
        result.put("message", isSuccess ? "注册成功" : "用户名或邮箱已存在");
        return result;
    }

    // 登录接口
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> params) {
        User user = userService.login(params.get("account"), params.get("password"));

        Map<String, Object> result = new HashMap<>();
        result.put("success", user != null);
        result.put("message", user != null ? "登录成功:" + user.getUserName() : "登录失败");
        result.put("userInfo", user); // 直接返回整个User对象
        System.out.println(user.getUserName());
        return result;
    }
    @GetMapping("/info")  // 匹配 /user/info?userId=xxx
    public User getUserInfo(@RequestParam Long userId) {  // 使用 @RequestParam
        User user = userService.getUserById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在"); // 避免返回 null
        }
        return user;
    }
}