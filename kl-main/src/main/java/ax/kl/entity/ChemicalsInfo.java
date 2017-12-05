package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 15:36 2017/12/5
 * @modified By:
 */
@Data
@TableName("TB_BASE_CHEMICAL_INFO")
public class ChemicalsInfo {

    @TableId("ChemId")
    @ApiModelProperty("化学品Id")
    private String chemId;

    @TableField("ChemName")
    @ApiModelProperty("化学品名称")
    private String chemName;

    @TableField("CAS")
    @ApiModelProperty("CAS")
    private String cAS;


}
