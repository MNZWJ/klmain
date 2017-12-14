package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 9:15 2017/12/14
 * @modified By:
 */
@Data
@TableName("TB_BASE_DR_LEGAL_PROTECTION")
public class LegalProtection {

    @TableId("TargetId")
    @ApiModelProperty("主键")
    private String targetId;


    @TableField("SourceId")
    @ApiModelProperty("所属重大危险源")
    private String sourceId;

    @TableField("ProtectArea")
    @ApiModelProperty("法律保护区")
    private String protectArea;

    @TableField("Environment")
    @ApiModelProperty("周边环境说明")
    private String environment;

    @TableField("Conformance")
    @ApiModelProperty("与规定符合性")
    private String conformance;

}
