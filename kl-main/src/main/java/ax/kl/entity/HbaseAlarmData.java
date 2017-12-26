package ax.kl.entity;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author: xum
 * @description:
 * @date: Created in 15:33 2017/12/25
 * @modified By:
 */
@Data
public class HbaseAlarmData {

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

    @ApiModelProperty("报警类型")
    private String alarmName;

    @ApiModelProperty("实时值")
    private String realValue;

    @ApiModelProperty("指标单位")
    private String targetUnit;

    @ApiModelProperty("报警时间")
    private String alarmDate;

}
