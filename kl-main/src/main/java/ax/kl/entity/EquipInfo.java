package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 设备基本信息
 * @author wangkang
 * Date 2017/12/15
 */
@Data
@TableName("TB_BASE_EQUIP_INFO")
@ApiModel("设备信息")
public class EquipInfo {

    @TableId("EquipId")
    @ApiModelProperty("设备ID")
    private String equipId;

    @TableField("UniqueCode")
    @ApiModelProperty("唯一编码")
    private String uniqueCode;

    @TableField("UnitId")
    @ApiModelProperty("所属工艺单元")
    private String unitId;

    @TableField("EquipName")
    @ApiModelProperty("设备名称")
    private String equipName;

    @TableField("EquipType")
    @ApiModelProperty("设备类型")
    private String equipType;

    @TableField("NormalPict")
    @ApiModelProperty("正常状态图片")
    private String normalPict;

    @TableField("AlarmPict")
    @ApiModelProperty("报警状态图片")
    private String alarmPict;

    @TableField("alarmNum")
    @ApiModelProperty("设备报警数量")
    private String alarmNum;


}
