package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 实时报警信息
 * @author wangbiao
 */
@Data
@TableName("TB_REALTIME_ALARM_DATA")
public class RealtimeAlarmData {

    @TableId("RealId")
    @ApiModelProperty("主键")
    private String realId;

    @TableField("EquipCode")
    @ApiModelProperty("设备编码")
    private String equipCode;

    @TableField("TargetCode")
    @ApiModelProperty("指标编码：0，状态报警")
    private String targetCode;

    @TableField("IDCode")
    @ApiModelProperty("识别码：ZB，指标；ZT，状态")
    private String iDCode;

    @TableField("AlarmCode")
    @ApiModelProperty("报警代码，关联报警代码表")
    private String alarmCode;

    @TableField("EquipType")
    @ApiModelProperty("设备类型，关联设备类型表")
    private String equipType;

    @TableField("AlarmDate")
    @ApiModelProperty("报警日期")
    private String AlarmDate;

    @TableField("RealValue")
    @ApiModelProperty("实时值")
    private String realValue;

    @TableField("Status")
    @ApiModelProperty("状态：0，恢复；1，产生报警")
    private String status;

    @TableField("Threshold")
    @ApiModelProperty("阈值")
    private String threshold;

}
