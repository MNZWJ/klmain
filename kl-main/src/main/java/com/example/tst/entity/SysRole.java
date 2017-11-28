package com.example.tst.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import lombok.Data;

/**
 * @Author: SuZhenpeng
 * Description:
 * Date: Created in 8:54 2017/11/23
 * @Modified By:
 */
@Data
@TableName("TB_SYS_MANAGERROLE")
public class SysRole {

    @TableId("RoleID")
    private String roleId;

    @TableField("RoleName")
    private String roleName;

    @TableField("RoleCode")
    private String roleCode;

    @TableField("IsUsed")
    private String isUsed;

    @TableField("IsDel")
    private String isDel;
}
