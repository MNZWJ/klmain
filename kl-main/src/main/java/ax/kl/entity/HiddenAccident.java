package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @Author: SuZhenpeng
 * Description:
 * Date: Created in 13:34 2017/12/6
 * @Modified By:
 */
@Data
@TableName("TB_BASE_HIDDEN_DANGER")
public class HiddenAccident {

  @TableId("DangerId")
  @ApiModelProperty("主键")
  private String dangerId;
  @TableField("DangerSource")
  @ApiModelProperty("危险源Id")
  private String dangerSource;
  @TableField("HiddenDanager")
  @ApiModelProperty("隐患描述")
  private String hiddenDanager;
  @TableField("Area")
  @ApiModelProperty("行政区划")
  private String area;
  @TableField("Industry")
  @ApiModelProperty("行业分类")
  private String industry;
  @TableField("SuperviseDept")
  @ApiModelProperty("隐患监管部门")
  private String superviseDept;
  @TableField("Source")
  @ApiModelProperty("隐患来源")
  private String source;
  @TableField("Category")
  @ApiModelProperty("隐患类别")
  private String category;
  @TableField("Rank")
  @ApiModelProperty("隐患级别")
  private String rank;
  @TableField("UpReportDate")
  @ApiModelProperty("上报日期")
  private String upReportDate;
  @TableField("ReformTerm")
  @ApiModelProperty("整改期限")
  private String reformTerm;
  @TableField("Rectification")
  @ApiModelProperty("整改情况")
  private String rectification;

  @TableField("CompanyName")
  @ApiModelProperty("公司名称")
  private String companyName;

  @TableField("SourceName")
  @ApiModelProperty("危险源名称")
  private String sourceName;

}
