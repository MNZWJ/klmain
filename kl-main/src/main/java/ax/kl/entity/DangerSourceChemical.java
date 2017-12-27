package ax.kl.entity;

import com.alibaba.fastjson.annotation.JSONField;
import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 化学物品与危险源联系，用于存储TB_REL_DRESOURCE_CHEMICAL表中数据
 */
@Data
@TableName("TB_REL_DRESOURCE_CHEMICAL")
public class DangerSourceChemical {
    /**
     *主键
     */
    @TableId("RelId")
    @ApiModelProperty("主键")
    private String relId;

    /**
     * 危险源Id
     */
    @TableField("SourceId")
    @ApiModelProperty("危险源ID")
    private String sourceId;

    @TableField("SourceName")
    @ApiModelProperty("危险源名称")
    private String sourceName;
    /**
     * 化学物品Id
     */
    @TableField("ChemId")
    @ApiModelProperty("化学物品Id")
    private String chemId;

    @TableField("ChemName")
    @ApiModelProperty("化学品名称")
    private String chemName;

    @TableField("CAS")
    @ApiModelProperty("CAS")
    private String cAS;

    @TableField("Dreserves")
    @ApiModelProperty("设计储量")
    private Double dreserves;


    @TableField("Unit")
    @ApiModelProperty("单位")
    private String unit;

}
