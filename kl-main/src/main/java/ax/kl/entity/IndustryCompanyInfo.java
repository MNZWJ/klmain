package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 10:40 2017/12/8
 * @modified By:
 */
@Data
@ApiModel("企业行业分布情况实体类")
public class IndustryCompanyInfo {

    @TableId("TypeId")
    @ApiModelProperty("类型Id")
    private String typeId;

    @TableField("TypeName")
    @ApiModelProperty("类型名称")
    private String typeName;

    @TableField("NumList")
    @ApiModelProperty("类型数据情况")
    private String numList;

    @TableField("Stack")
    @ApiModelProperty("echarts类目")
    private String stack;

}
