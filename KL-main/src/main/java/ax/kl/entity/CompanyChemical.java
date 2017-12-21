package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 公司相关化学品
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
@Data
@TableName("TB_REL_COMPANY_CHEMICAL")
public class CompanyChemical {

    @TableId("RelId")
    @ApiModelProperty("主键")
    private String relId;

    @TableField("ChemId")
    @ApiModelProperty("危险源化学品目录ID")
    private String chemId;

    @TableField("ChemName")
    @ApiModelProperty("危险源化学品名称")
    private String chemName;

    @TableField("CompanyId")
    @ApiModelProperty("所属企业")
    private String companyId;

    @TableField("CAS")
    @ApiModelProperty("CAS")
    private String cAS;

    @TableField("Dreserves")
    @ApiModelProperty("设计储量")
    private String dreserves;


    @TableField("Unit")
    @ApiModelProperty("单位")
    private String unit;
}
