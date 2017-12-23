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
 * @date: Created in 14:49 2017/12/13
 * @modified By:
 */
@Data
@ApiModel("工艺单元")
@TableName("TB_BASE_PROCESS_UNIT")
public class ProcessUnit {

    @ApiModelProperty("主键")
    @TableId("UnitId")
    private String unitId;

    //所属企业
    private String companyName;

    @ApiModelProperty("唯一编码")
    @TableField("UniqueCode")
    private String uniqueCodeU;


    @ApiModelProperty("所属重大危险源")
    @TableField("SourceId")
    private String sourceId;

    @ApiModelProperty("工艺单元名称")
    @TableField("UnitName")
    private String unitName;

    @ApiModelProperty("火灾爆炸指数")
    @TableField("FEI")
    private Double fEI;

    @ApiModelProperty("危险等级")
    @TableField("DangerRank")
    private String dangerRank;

    @ApiModelProperty("补偿后的火灾爆炸指数")
    @TableField("AfterFEI")
    private Double afterFEI;

    @ApiModelProperty("补偿后的危险等级")
    @TableField("AfterDangerRank")
    private String afterDangerRank;


    @ApiModelProperty("状态")
    @TableField("Status")
    private String status;

    @ApiModelProperty("计算后的火灾爆炸指数")
    @TableField("RealFEI")
    private Double realFEI;

}
