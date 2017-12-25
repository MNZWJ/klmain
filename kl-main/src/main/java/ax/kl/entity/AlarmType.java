package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 报警类型信息
 * @author wangbiao
 * Date 2017/12/15
 */
@Data
@TableName("TB_BASE_ALARM_TYPE")
@ApiModel("报警类型")
public class AlarmType {

    @TableId("TypeCode")
    @ApiModelProperty("报警类型唯一编码")
    private String typeCode;

    @TableField("TypeName")
    @ApiModelProperty("报警类型名称")
    private String typeName;

    @TableField("IDCode")
    @ApiModelProperty("报警类型识别码")
    private String iDCode;

}
