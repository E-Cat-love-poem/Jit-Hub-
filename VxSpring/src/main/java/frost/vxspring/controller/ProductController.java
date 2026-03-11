package frost.vxspring.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import frost.vxspring.pojo.Product;
import frost.vxspring.service.IProductService;
import org.apache.ibatis.annotations.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    private IProductService productService; // 注入接口而非实现类

    // 1. 新增产品（使用MyBatis-Plus的save方法）
    @PostMapping("/add")
    public boolean addProduct(@RequestBody Product product) {
        return productService.save(product);
    }

    // 2. 获取精选商品
    @GetMapping("/featured")
    public List<Product> getFeaturedProducts() {
        return productService.getFeaturedProducts();
    }

    // 3. 按分类查询（示例）
    @GetMapping("/category/{categoryId}")
    public List<Product> getByCategory(@PathVariable Integer categoryId) {
        return productService.getProductsByCategory(categoryId);
    }

    @GetMapping("/detail/{id}")
    public Product getProductDetail(@PathVariable Long id) {
        return productService.getById(id); // MyBatis-Plus提供的默认方法
    }

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String keyword) {
        LambdaQueryWrapper<Product> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.like(Product::getName, keyword)
                .or()
                .like(Product::getShortDesc, keyword)
                .or()
                .like(Product::getDetailDesc, keyword);

        return productService.list(queryWrapper);
    }

}