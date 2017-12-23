package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author: xum
 * @description:
 * @date: Created in 19:36 2017/12/19
 * @modified By:
 */
@Data
public class MonitorData {

    @ApiModelProperty("序号")
    private String dataNum;

    @ApiModelProperty("主键")
    private String dataId;

    @ApiModelProperty("企业名称")
    private String companyName;

    @ApiModelProperty("重大危险源名称")
    private String dResourceName;

    @ApiModelProperty("工艺单元")
    private String unitName;

    @ApiModelProperty("设备名称")
    private String equipName;

    @ApiModelProperty("指标名称")
    private String targetName;

    @ApiModelProperty("实时值")
    private String realValue;

    @ApiModelProperty("指标单位")
    private String targetUnit;

    @ApiModelProperty("采集时间")
    private String collectDate;

}
