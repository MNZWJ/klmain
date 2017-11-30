package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import io.swagger.annotations.ApiModel;
import lombok.Data;

@Data
@TableName("TB_SYS_USER")
@ApiModel(value = "人员的登陆表")
public class SysUser {
    @TableId("UserId")
    private String userId;

    @TableField("LoginName")
    private String loginName;

    @TableField("PassWord")
    private String passWord;

    @TableField("BusinessUserId")
    private String businessUserId;
}
