package frost.vxspring.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import frost.vxspring.pojo.User;
import org.apache.ibatis.annotations.*;


@Mapper
public interface UserMapper extends BaseMapper<User> {
    @Results({
            @Result(column = "user_id", property = "user_id"),
            @Result(column = "user_name", property = "user_name"),
            @Result(column = "email", property = "email"),
            @Result(column = "password", property = "password")
    })
    @Select("SELECT user_id, user_name, email, password FROM wx_user WHERE (user_name = #{account} OR email = #{account}) AND password = #{password}")
    User selectForLogin(@Param("account") String account, @Param("password") String password);

}