package frost.vxspring.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import frost.vxspring.pojo.Product;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ProductMapper extends BaseMapper<Product> {
    // 保留自定义SQL方法（注解方式）
    @Select("SELECT * FROM product WHERE status = 1 ORDER BY create_time DESC LIMIT 6")
    List<Product> selectFeaturedProducts();

    // 注意：不再需要定义以下方法（BaseMapper已提供）
    // int insert(Product entity);
    // int updateById(Product entity);
    // int deleteById(Serializable id);
    @Select("SELECT * FROM product WHERE " +
            "(name LIKE CONCAT('%',#{keyword},'%') OR " +
            "short_desc LIKE CONCAT('%',#{keyword},'%')) " +
            "AND status = 1")
    List<Product> searchProductsByKeyword(@Param("keyword") String keyword);
}