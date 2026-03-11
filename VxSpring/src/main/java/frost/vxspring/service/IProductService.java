package frost.vxspring.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.IService;
import frost.vxspring.pojo.Product;
import java.util.List;

public interface IProductService extends IService<Product> {
    // 自定义扩展方法
    List<Product> getFeaturedProducts();

    // 可选：其他业务方法
    List<Product> getProductsByCategory(Integer categoryId);

    List<Product> searchProducts(String keyword);
}