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
        if (user != null) {
            result.put("success", true);
            result.put("message", "登录成功:" + user.getUserName());
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("user_id", user.getUserId());
            userInfo.put("user_name", user.getUserName());
            userInfo.put("email", user.getEmail());
            result.put("userInfo", userInfo);
        } else {
            result.put("success", false);
            result.put("message", "登录失败");
            result.put("userInfo", null);
        }
        return result;
    }
    @GetMapping("/info")  // 匹配 /user/info?userId=xxx
    public Map<String, Object> getUserInfo(@RequestParam Long userId) {  // 使用 @RequestParam
        Map<String, Object> result = new HashMap<>();
        User user = userService.getUserById(userId);
        if (user == null) {
            result.put("code", 404);
            result.put("message", "用户不存在");
            return result;
        }
        result.put("userId", user.getUserId());
        result.put("userName", user.getUserName());
        result.put("password", user.getPassword());
        result.put("email", user.getEmail());
        return result;
    }
}