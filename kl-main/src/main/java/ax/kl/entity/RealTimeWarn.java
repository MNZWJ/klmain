package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 14:15 2017/12/15
 * @modified By:
 */
@Data
@ApiModel("实时预警数据")
public class RealTimeWarn {

    @TableField("CompanyName")
    @ApiModelProperty("公司名称")
    private String companyName;

    @ApiModelProperty("危险源Id")
    @TableField("SourceId")
    private String sourceId;

    @ApiModelProperty("危险源名称")
    @TableField("SourceName")
    private String sourceName;

    @TableField("FEI")
    @ApiModelProperty("火灾爆炸指数")
    private Double fEI;


    @TableField("ConditionNum")
    @ApiModelProperty("危险距离数量")
    private Long conditionNum;

    @ApiModelProperty("法律保护区域危险数量")
    @TableField("ProtectionNum")
    private Long protectionNum;

    @ApiModelProperty("一般隐患数量")
    @TableField("GeneralHidden")
    private Long generalHidden;

    @ApiModelProperty("重大隐患数量")
    @TableField("MajorHidden")
    private Long majorHidden;

    @ApiModelProperty("危险源等级")
    @TableField("Rank")
    private String rank;

    @ApiModelProperty("工艺单元报警数量")
    @TableField("ProcessUnitNum")
    private Long processUnitNum;

    @ApiModelProperty("气体报警数量")
    @TableField("AirStatusNum")
    private Long airStatusNum;

}
