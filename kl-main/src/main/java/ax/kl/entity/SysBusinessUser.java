package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@TableName("TB_SYS_BUSINESSUSER")
@ApiModel(value = "人员维护")
public class SysBusinessUser {

    @TableId("UserId")
    @ApiModelProperty(value = "身份证号")
    private String userId;

    @TableField("UserName")
    @ApiModelProperty(value = "人员姓名")
    private String userName;

    @TableField("LoginName")
    @ApiModelProperty(value = "登录名")
    private String loginName;

    @TableField("DeptId")
    @ApiModelProperty(value = "部门ID")
    private String deptId;

    @TableField("CreateUserId")
    @ApiModelProperty(value = "创建用户ID")
    private String createUserId;

    @TableField("CreateDeptId")
    @ApiModelProperty(value = "创建部门ID")
    private String createDeptId;

    @TableField("CreateTime")
    @ApiModelProperty(value = "创建时间")
    private String createTime;

    @TableField("Sex")
    @ApiModelProperty(value = "性别")
    private String sex;

    @TableField("WorkNum")
    @ApiModelProperty(value = "工作号")
    private String workNum;

    @TableField("DeptCode")
    @ApiModelProperty(value = "部门编码")
    private String deptCode;

    @TableField("PositionId")
    @ApiModelProperty(value = "岗位ID")
    private String positionId;

    @TableField("StationId")
    @ApiModelProperty(value = "分类ID")
    private String StationId;

    @TableField("Telephone")
    @ApiModelProperty(value = "电话号")
    private String telephone;

    @TableField("SendType")
    @ApiModelProperty(value = "发送类型")
    private String sendType;

    @TableField("IsWxCreated")
    @ApiModelProperty(value = "是否有权限创建")
    private String isWxCreated;

}
