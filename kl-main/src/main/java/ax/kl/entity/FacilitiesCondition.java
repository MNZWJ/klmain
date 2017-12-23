package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 8:18 2017/12/14
 * @modified By:
 */
@Data
@TableName("TB_BASE_DR_FACILITIES_CONDITION")
@ApiModel("周边环境信息")
public class FacilitiesCondition {

    @TableId("TargetId")
    @ApiModelProperty("主键")
    private String targetId;


    @TableField("SourceId")
    @ApiModelProperty("所属重大危险源")
    private String sourceId;


    @TableField("Facilities")
    @ApiModelProperty("装置设施名称")
    private String facilities;

    @TableField("Environment")
    @ApiModelProperty("周边环境名称")
    private String environment;


    @TableField("RealDistance")
    @ApiModelProperty("实际名称")
    private double realDistance;

    @TableField("StandardDistance")
    @ApiModelProperty("标准要求")
    private double standardDistance;


    @TableField("Conformance")
    @ApiModelProperty("与标准符合性")
    private String conformance;

}
