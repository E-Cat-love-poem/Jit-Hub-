package frost.vxspring.service;


import com.baomidou.mybatisplus.extension.service.IService;
import frost.vxspring.pojo.Order;


import java.util.List;

public interface IOrderService extends IService<Order> {

    /**
     * 创建订单
     * @param order 订单信息
     * @return 是否创建成功
     */
    boolean createOrder(Order order);

    /**
     * 支付订单
     * @param orderId 订单ID
     * @return 是否支付成功
     */
    boolean payOrder(Long orderId);

    /**
     * 获取所有订单（按创建时间倒序）
     * @return 订单列表
     */
    List<Order> getAllOrders();

    /**
     * 根据状态获取订单
     * @param status 订单状态
     * @return 订单列表
     */
    List<Order> getOrdersByStatus(Integer status);

    /**
     * 获取订单详情
     * @param orderId 订单ID
     * @return 订单详情
     */
    Order getOrderDetail(Long orderId);
}