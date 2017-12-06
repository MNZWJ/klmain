package ax.kl.entity;

import com.alibaba.fastjson.annotation.JSONField;
import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableName;
import lombok.Data;

/**
 * 角色人员
 * @author wangbiao
 * Date 2017/11/30
 */
@Data
@TableName("TB_SYS_MANAGERROLEUSER")
public class SysRoleUser {

    /**角色Id*/
    @TableField("RoleId")
    private String roleId;

    /**人员Id*/
    @TableField("UserId")
    private String userId;
}
