package ax.kl.entity;

import com.alibaba.fastjson.annotation.JSONField;
import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import lombok.Data;

@Data
public class SysRoleMenu {

    @TableId("MenuId")
    @JSONField(name = "MenuId")
    private String MenuId;

    @TableField("ParentMenuId")
    @JSONField(name = "ParentMenuId")
    private String ParentMenuId;

    @TableField("MenuName")
    @JSONField(name = "MenuName")
    private String MenuName;

    @TableField("RoleId")
    @JSONField(name = "MenuName")
    private String RoleId;
}
