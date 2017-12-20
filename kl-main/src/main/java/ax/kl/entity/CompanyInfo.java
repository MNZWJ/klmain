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

  @TableField(value = "DirectArea")
  @ApiModelProperty("直属区域，字典")
  private String directArea;

  @ApiModelProperty("危险工艺Id")
  @TableField(value = "TechnologyId",exist =false)
  private String technologyId;

  @ApiModelProperty("危险工艺名称")
  @TableField(value = "TechnologyName",exist =false)
  private String technologyName;

  @ApiModelProperty("重点监控单元")
  @TableField(value = "MonitorUnit",exist =false)
  private String monitorUnit;

  @ApiModelProperty("企业性质")
  @TableField(value = "CompanyType",exist =false)
  private String companyType;

  @TableField(value = "CertType",exist =false)
  @ApiModelProperty("证书类型，字典")
  private String certType;

  @TableField(value = "CertTypeName",exist =false)
  @ApiModelProperty("证书类型名称，字典")
  private String certTypeName;

  @TableField(value = "CertNo",exist =false)
  @ApiModelProperty("证书编号")
  private String certNo;

  @TableField(value = "StartDate",exist =false)
  @ApiModelProperty("开始日期")
  private String startDate;

  @TableField(value = "Validity",exist =false)
  @ApiModelProperty("有效期，字典")
  private String validity;

  @TableField(value = "CertificateAlarm",exist = false)
  @ApiModelProperty("证书预警")
  private String certificateAlarm;

  @TableField(value = "RealtimeAlarm",exist = false)
  @ApiModelProperty("设备预警")
  private String realtimeAlarm;
}
