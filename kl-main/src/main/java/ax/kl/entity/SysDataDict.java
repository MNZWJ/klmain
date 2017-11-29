package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import lombok.Data;

/**
 * @Author: SuZhenpeng
 * Description:
 * Date: Created in 14:25 2017/11/17
 * @Modified By:
 */
@Data
@TableName("TB_SYS_DATADICT")
public class SysDataDict {

    @TableId("DictId")
    private String dictId;

    @TableField("DictName")
    private String dictName;

    @TableField("TypeId")
    private String typeId;

    @TableField("IsDel")
    private String isDel;

    @TableField("IsUsed")
    private String isUsed;

    @TableField("DictOrder")
    private String dictOrder;

    @TableField("DictCode")
    private String dictCode;


}
