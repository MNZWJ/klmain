package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 企业证书
 * @author wangbiao
 */
@Data
@TableName("TB_BASE_COMPANY_CERTIFICATE")
public class CompanyCertificate {

    @TableId("CertId")
    @ApiModelProperty("主键")
    private String certId;

    @TableField("CompanyId")
    @ApiModelProperty("所属企业")
    private String companyId;

    @TableField("CerType")
    @ApiModelProperty("证书类型，字典")
    private String cerType;

    @TableField("CertNo")
    @ApiModelProperty("证书编号")
    private String certNo;

    @TableField("StartDate")
    @ApiModelProperty("开始日期")
    private String startDate;

    @TableField("Validity")
    @ApiModelProperty("有效期")
    private String validity;
}
