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
    @TableField("RoleId")
    @JSONField(name = "RoleId")
    private String RoleId;

    @TableField("UserId")
    @JSONField(name = "UserId")
    private String UserId;
}
