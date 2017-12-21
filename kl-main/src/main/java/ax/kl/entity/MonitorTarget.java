package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 指标
 * @author wangbiao
 */
@Data
@TableName("TB_BASE_MONITOR_TARGET")
public class MonitorTarget {

    @TableId("TargetCode")
    @ApiModelProperty("指标编码")
    private String targetCode;

    @TableId("TargetName")
    @ApiModelProperty("指标名称")
    private String targetName;

    @TableId("PCode")
    @ApiModelProperty("上级编码")
    private String pCode;

    @TableId("LevelCode")
    @ApiModelProperty("层级编码")
    private String levelCode;

    @TableId("Unit")
    @ApiModelProperty("计量单位")
    private String unit;
}
