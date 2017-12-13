package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@TableName("TB_BASE_COMPANY_INFO")
@ApiModel("企业信息")
public class CompanyInfo {

  @TableId("CompanyId")
  @ApiModelProperty("企业ID")
  private String companyId;

  @TableField("UniqueCode")
  @ApiModelProperty("唯一编码")
  private String uniqueCode;

  @TableField("CompanyName")
  @ApiModelProperty("企业名称")
  private String companyName;

  @TableField("Area")
  @ApiModelProperty("行政区域")
  private String area;

  @TableField("LegalPerson")
  @ApiModelProperty("法人代表")
  private String legalPerson;

  @TableField("ContactWay")
  @ApiModelProperty("联系方式")
  private String contactWay;

  @TableField("IndustryCode")
  @ApiModelProperty("所属行业，字典")
  private String industryCode;

  @TableField("SafeManageRank")
  @ApiModelProperty("安全管理分级，字典")
  private String safeManageRank;

  @TableField("StandardRank")
  @ApiModelProperty("标准化等级，字典")
  private String standardRank;

  @TableField("OperatingState")
  @ApiModelProperty("经营状态，字典")
  private String operatingState;
  @TableField("Longt")
  @ApiModelProperty("经度")
  private String longt;
  @TableField("Lat")
  @ApiModelProperty("纬度")
  private String lat;
  @TableField("ScaleCode")
  @ApiModelProperty("企业规模，字典")
  private String scaleCode;
  @TableField(value = "TypeCode")
  @ApiModelProperty("企业类型，字典")
  private String typeCode;
  @ApiModelProperty("危险工艺Id")
  @TableField(value = "TechnologyId",exist =false)
  private String technologyId;

  @ApiModelProperty("危险工艺名称")
  @TableField(value = "TechnologyName",exist =false)
  private String technologyName;

  @ApiModelProperty("重点监控单元")
  @TableField(value = "MonitorUnit",exist =false)
  private String monitorUnit;

  @TableField(value = "CompanyType",exist =false)
  @ApiModelProperty("企业类型名称，字典")
  private String companyType;
}
