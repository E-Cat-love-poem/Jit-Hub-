package frost.vxspring.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import frost.vxspring.mapper.ProductMapper;
import frost.vxspring.pojo.Product;
import frost.vxspring.service.IProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductServiceImpl extends ServiceImpl<ProductMapper, Product>
        implements IProductService {

    @Override
    public List<Product> getFeaturedProducts() {
        // 方式1：直接调用Mapper自定义方法
        return baseMapper.selectFeaturedProducts();

        // 方式2：使用LambdaQueryWrapper (MyBatis-Plus风格)
        // return lambdaQuery()
        //     .eq(Product::getStatus, 1)
        //     .orderByDesc(Product::getCreateTime)
        //     .last("LIMIT 6")
        //     .list();
    }

    @Override
    public List<Product> getProductsByCategory(Integer categoryId) {
        return lambdaQuery()
                .eq(Product::getCategoryId, categoryId)
                .eq(Product::getStatus, 1)
                .list();
    }

    @Override
    public List<Product> searchProducts(String keyword) {
        return lambdaQuery()
                .and(wrapper -> wrapper
                        .like(Product::getName, keyword)
                        .or()
                        .like(Product::getShortDesc, keyword)  // 使用正确的字段名
                        .or()
                        .like(Product::getDetailDesc, keyword) // 使用正确的字段名
                )
                .eq(Product::getStatus, 1)
                .orderByDesc(Product::getCreateTime)
                .list();
    }

}