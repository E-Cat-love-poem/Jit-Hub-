package frost.vxspring.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import frost.vxspring.pojo.Product;
import frost.vxspring.service.IProductService;
import org.apache.ibatis.annotations.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private IProductService productService; // 注入接口而非实现类

    // 1. 新增产品（使用MyBatis-Plus的save方法）
    @PostMapping("/add")
    public Map<String, Object> addProduct(@RequestBody Product product) {
        Map<String, Object> result = new HashMap<>();
        try {
            if (product.getName() == null || product.getCategoryId() == null) {
                result.put("code", 400);
                result.put("message", "参数错误：name 或 categoryId 缺失");
                return result;
            }
            boolean success = productService.save(product);
            if (success) {
                result.put("code", 200);
                result.put("data", product);
                result.put("message", "success");
            } else {
                result.put("code", 500);
                result.put("message", "数据库插入失败");
            }
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", e.getMessage());
        }
        return result;
    }

    // 2. 获取精选商品
    @GetMapping("/featured")
    public Map<String, Object> getFeaturedProducts() {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Product> products = productService.getFeaturedProducts();
            result.put("code", 200);
            result.put("data", products);
            result.put("message", "success");
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", e.getMessage());
            result.put("data", new ArrayList<>());
        }
        return result;
    }

    // 3. 按分类查询（示例）
    @GetMapping("/category/{categoryId}")
    public List<Product> getByCategory(@PathVariable Integer categoryId) {
        return productService.getProductsByCategory(categoryId);
    }

    @GetMapping("/detail/{id}")
    public Map<String, Object> getProductDetail(@PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        Product product = productService.getById(id);
        if (product == null) {
            result.put("code", 404);
            result.put("message", "产品不存在");
            return result;
        }
        result.put("code", 200);
        result.put("data", product);
        result.put("message", "success");
        return result;
    }

    @GetMapping("/search")
    public Map<String, Object> searchProducts(@RequestParam String keyword) {
        Map<String, Object> result = new HashMap<>();
        if (keyword == null || keyword.isEmpty()) {
            result.put("code", 400);
            result.put("message", "keyword不能为空");
            return result;
        }
        LambdaQueryWrapper<Product> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.and(wrapper -> wrapper
                .like(Product::getName, keyword)
                .or()
                .like(Product::getShortDesc, keyword)
                .or()
                .like(Product::getDetailDesc, keyword))
                .eq(Product::getStatus, 1)
                .orderByDesc(Product::getCreateTime);

        List<Product> products = productService.list(queryWrapper);
        result.put("code", 200);
        result.put("data", products);
        result.put("message", "success");
        return result;
    }

}