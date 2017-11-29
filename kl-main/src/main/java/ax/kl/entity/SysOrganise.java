package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@TableName("TB_SYS_Organise")
@ApiModel(value = "组织机构")
public class SysOrganise {

    @TableId("OrganiseId")
    @ApiModelProperty(value ="组织机构id" )
    private String organiseId;

    @TableField("OrganiseName")
    @ApiModelProperty(value ="组织机构名称" )
    private String organiseName;

    @TableField("ParentId")
    @ApiModelProperty(value ="父节点id" )
    private String parentId;

    @TableField("OrgType")
    @ApiModelProperty(value ="组织机构类型" )
    private String orgType;

    @TableField("ShowOrder")
    @ApiModelProperty(value ="组织机构序号" )
    private int showOrder;

    @TableField("IsDel")
    @ApiModelProperty(value ="是否删除" )
    private String isDel;

    @TableField("OrganiseCode")
    @ApiModelProperty(value ="组织机构code码" )
    private String organiseCode;

    @TableField("iconField")
    @ApiModelProperty(value ="组织结构图标" )
    private String iconField;

    @TableField("OrganiseLevel")
    @ApiModelProperty(value ="组织机构等级" )
    private String organiseLevel;

}
