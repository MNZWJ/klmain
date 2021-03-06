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


    @TableField("DeptCode")
    @ApiModelProperty(value = "部门编码")
    private String deptCode;



    @TableField("Telephone")
    @ApiModelProperty(value = "电话号")
    private String telephone;




    @TableField("PassWord")
    @ApiModelProperty(value = "密码")
    private String passWord;


    @ApiModelProperty(value = "是否需要登陆")
    private String isLogin;

}
