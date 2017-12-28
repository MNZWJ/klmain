package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import lombok.Data;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 15:00 2017/12/28
 * @modified By:
 */
@Data
public class AlarmInfoEntity {


    @TableId("RealId")
    private String realId;
    @TableField("EquipCode")
    private String equipCode;
    @TableField("AlarmCode")
    private String alarmCode;
    @TableField("AlarmDate")
    private String alarmDate;
    @TableField("RealValue")
    private  String realValue;
    @TableField("Threshold")
    private String threshold;

}
