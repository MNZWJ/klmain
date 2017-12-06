package ax.kl.entity;

import com.alibaba.fastjson.annotation.JSONField;
import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import lombok.Data;

/**
 * 角色菜单
 * @author wangbiao
 * Date 2017/11/28
 */
@Data
public class SysRoleMenu {

    /**主键菜单Id*/
    @TableId("MenuId")
    private String menuId;

    /**父菜单Id*/
    @TableField("ParentMenuId")
    private String parentMenuId;

    /**菜单名称*/
    @TableField("MenuName")
    private String menuName;

    /**角色Id*/
    @TableField("RoleId")
    private String roleId;
}
