package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import io.swagger.annotations.ApiModel;
import lombok.Data;

/**
 * @author Administrator
 */
@Data
@TableName("TB_SYS_MANAGERROLEUSER")
@ApiModel(value = "人员角色管理表")
public class SysUserRole {

    @TableId("Id")
    private String id;

    @TableField("UserId")
    private String userId;

    @TableField("RoleId")
    private String roleId;
}
