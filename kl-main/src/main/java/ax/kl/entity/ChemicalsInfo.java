package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 15:36 2017/12/5
 * @modified By:
 */
@Data
@TableName("TB_BASE_CHEMICAL_INFO")
public class ChemicalsInfo {

    @TableId("ChemId")
    @ApiModelProperty("化学品Id")
    private String chemId;

    @TableField("ChemName")
    @ApiModelProperty("化学品名称")
    private String chemName;

    @TableField("CAS")
    @ApiModelProperty("CAS")
    private String cAS;

    @TableField("EquipName")
    @ApiModelProperty("设备名称")
    private String equipName;

    @TableField("UnitName")
    @ApiModelProperty("工艺单元名称")
    private String unitName;

    @TableField("SourceName")
    @ApiModelProperty("危险源名称")
    private String sourceName;

    @TableField("CompanyName")
    @ApiModelProperty("企业名称")
    private String companyName;

    @TableField("Area")
    @ApiModelProperty("行政区域")
    private String area;

}
