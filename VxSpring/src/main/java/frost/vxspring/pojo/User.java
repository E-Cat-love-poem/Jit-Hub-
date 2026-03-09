package frost.vxspring.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data

@TableName("wx_user")
public class User {
    @TableId(type = IdType.AUTO)
    @TableField("user_id")
    @JsonProperty("user_id")
    private Long userId;
    @TableField("user_name")
    @JsonProperty("user_name")
    private String userName;
    private String password;
    private String email;
    // 其他字段...

    public void setUser_id(Long user_id) {
        this.userId = user_id;
    }

    public void setUser_name(String user_name) {
        this.userName = user_name;
    }
}