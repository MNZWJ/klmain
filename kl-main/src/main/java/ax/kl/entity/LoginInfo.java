package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("登录信息")
public class LoginInfo {

  @ApiModelProperty("用户ID")
  private String userId;

  @ApiModelProperty("用户名")
  private String userName;

  @ApiModelProperty("单位ID")
  private String orgId;

  @ApiModelProperty("单位编码")
  private String orgCode;

  @ApiModelProperty("单位名称")
  private String orgName;

  @ApiModelProperty("单位类型")
  private String orgType;

}
