package frost.vxspring.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import frost.vxspring.pojo.Order;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface OrderMapper extends BaseMapper<Order> {
    @Insert("INSERT INTO orders(product_id, product_name, price, status) " +
            "VALUES(#{product_id}, #{product_name}, #{price}, 0)")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int createOrder(Order order);

    @Update("UPDATE orders SET status = #{status}, pay_time = NOW() WHERE id = #{id}")
    int updateOrderStatus(@Param("id") Integer id, @Param("status") Integer status);

    @Select("SELECT * FROM orders WHERE status = #{status}")
    List<Order> getOrdersByStatus(Integer status);

    @Select("SELECT * FROM orders")
    List<Order> getAllOrders();
}