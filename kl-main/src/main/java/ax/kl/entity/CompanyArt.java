package ax.kl.entity;


import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@TableName("TB_REL_COMPANY_ART")
@ApiModel("危险化学工艺")
public class CompanyArt {

  @ApiModelProperty("Id")
  @TableId("RelationId")
  private String relationId;

  @ApiModelProperty("公司Id")
  @TableField("CompanyId")
  private String companyId;

  @ApiModelProperty("危险工艺Id")
  @TableField("TechnologyId")
  private String technologyId;

  @ApiModelProperty("危险工艺名称")
  @TableField(value = "TechnologyName",exist =false)
  private String technologyName;

  @ApiModelProperty("重点监控单元")
  @TableField("MonitorUnit")
  private String monitorUnit;


}
