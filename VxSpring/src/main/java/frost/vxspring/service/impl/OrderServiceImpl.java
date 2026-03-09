package frost.vxspring.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import frost.vxspring.mapper.OrderMapper;
import frost.vxspring.pojo.Order;
import frost.vxspring.service.IOrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

/**
 * <p>
 * 订单服务实现类
 * </p>
 *
 * @author H
 * @since 2025-05-12
 */
@Service
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Order> implements IOrderService {

    @Override
    public boolean createOrder(Order order) {
        order.setStatus(0); // 0表示待支付
        order.setCreateTime(new Date());
        order.setPayTime(null);
        return this.save(order);
    }

    @Override
    public boolean payOrder(Long orderId) {
        Order order = this.getById(orderId);
        if (order != null && order.getStatus() == 0) {
            order.setStatus(1); // 1表示已支付
            order.setPayTime(new Date());
            return this.updateById(order);
        }
        return false;
    }

    @Override
    public List<Order> getAllOrders() {
        return this.list(new LambdaQueryWrapper<Order>()
                .orderByDesc(Order::getCreateTime));
    }

    @Override
    public List<Order> getOrdersByStatus(Integer status) {
        return this.list(new LambdaQueryWrapper<Order>()
                .eq(Order::getStatus, status)
                .orderByDesc(Order::getCreateTime));
    }

    @Override
    public Order getOrderDetail(Long orderId) {
        return this.getById(orderId);
    }
}