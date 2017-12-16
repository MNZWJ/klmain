package ax.kl.entity;

import com.alibaba.fastjson.annotation.JSONField;
import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 设备类型信息
 * @author wangbiao
 * Date 2017/12/15
 */
@Data
@TableName("TB_BASE_EQUIP_TYPE")
@ApiModel("设备类型")
public class EquipType {

    @TableId("TypeCode")
    @ApiModelProperty("设备类型编码")
    private String typeCode;

    @TableField("TypeName")
    @ApiModelProperty("设备类型")
    private String typeName;

    @TableField("PCode")
    @ApiModelProperty("上级编码")
    private String pCode;

    @TableField("LeveCode")
    @ApiModelProperty("层级吗")
    private String leveCode;

    @TableField("TypeOrder")
    @ApiModelProperty("排序")
    private String typeOrder;
}
