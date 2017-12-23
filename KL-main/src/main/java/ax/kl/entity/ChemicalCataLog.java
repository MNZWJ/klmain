package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 危险化学品目录
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
@Data
@TableName("TB_BASE_CHEMICAL_CATALOG")
public class ChemicalCataLog {

    @TableId("ChemId")
    @ApiModelProperty("化学品Id")
    private String chemId;

    @TableField("ChemName")
    @ApiModelProperty("化学品名称")
    private String chemName;


    @TableField("AlisaName")
    @ApiModelProperty("别名")
    private String alisaName;



    @TableField("CAS")
    @ApiModelProperty("CAS")
    private String cAS;


    @TableField("DangerType")
    @ApiModelProperty("化学品危险类别")
    private String dangerType;

    @TableField("Htoxic")
    @ApiModelProperty("剧毒")
    private String htoxic;


    @TableField("Supervise")
    @ApiModelProperty("重点监管")
    private String supervise;


    @TableField("Poison")
    @ApiModelProperty("易制毒")
    private String poison;

    @TableField("Detonating")
    @ApiModelProperty("易制爆")
    private String detonating;

}
