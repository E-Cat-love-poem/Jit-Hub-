package frost.vxspring.controller;

import frost.vxspring.pojo.Order;
import frost.vxspring.service.IOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private IOrderService orderService;

    @PostMapping("/create")
    public Map<String, Object> createOrder(@RequestBody Map<String, Object> params){
        Integer product_id = (Integer) params.get("product_id");
        String product_name = (String) params.get("product_name");
        Object priceObj = params.get("price");
        Map<String, Object> result = new HashMap<>();

        // 参数验证
        if (product_id == null || product_name == null || priceObj == null) {
            result.put("success", false);
            result.put("message", "缺少必填参数");
            return result;
        }

        Long price = Long.valueOf(priceObj.toString());

        Order order = new Order();
        order.setProductId(product_id);
        order.setProductName(product_name);
        order.setPrice(price);

        try {
            boolean success = orderService.createOrder(order);

            result.put("success", success);
            result.put("message", success ? "课程创建成功" : "创建失败");
            result.put("data", order);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "创建失败: " + e.getMessage());
            result.put("data", null);
        }

        return result;
    }

    @PutMapping("/{orderId}/pay")
    public Map<String, Object> payOrder(@PathVariable Long orderId) {
        Map<String, Object> result = new HashMap<>();

        Order order = orderService.getOrderDetail(orderId);
        if (order == null) {
            result.put("success", false);
            result.put("message", "课程不存在");
            result.put("orderId", orderId);
            return result;
        }

        if (order.getStatus() != 0) {
            result.put("success", false);
            result.put("message", "课程确认失败或课程不存在");
            result.put("orderId", orderId);
            return result;
        }

        boolean success = orderService.payOrder(orderId);

        result.put("success", success);
        result.put("message", success ? "课程确认成功" : "课程确认失败");
        result.put("orderId", orderId);

        return result;
    }

    @GetMapping("/all")
    public Map<String, Object> getAllOrders() {
        Map<String, Object> result = new HashMap<>();

        List<Order> orders = orderService.getAllOrders();

        result.put("success", true);
        result.put("message", "获取订单列表成功");
        result.put("data", orders);

        return result;
    }

    @GetMapping("/status/{status}")
    public Map<String, Object> getOrdersByStatus(@PathVariable Integer status) {
        Map<String, Object> result = new HashMap<>();

        List<Order> orders = orderService.getOrdersByStatus(status);

        result.put("success", true);
        result.put("message", "根据状态获取订单成功");
        result.put("data", orders);

        return result;
    }
}