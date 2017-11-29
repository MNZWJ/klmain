package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.annotations.ApiOperation;
import lombok.Data;

@Data
@ApiModel(value = "岗位类型信息")
@TableName("TB_WORKTYPE_INFO")
public class WorkTypeInfo {

    @TableId("Id")
    @ApiModelProperty(value = "岗位类型id")
    private String id;
    @TableField("WorkTypeName")
    @ApiModelProperty(value = "岗位类型名称")
    private String workTypeName;
}
