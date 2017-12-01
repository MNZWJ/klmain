package ax.kl.entity;

import com.alibaba.fastjson.annotation.JSONField;
import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableName;
import lombok.Data;

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
