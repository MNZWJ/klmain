package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableName;
import lombok.Data;

@Data
@TableName("TB_BASE_DANGERSOURCE_INFO")
public class MajorHazard {

    //Id
    @TableField(value = "SourceId")
    private String SourceId;

    //唯一编码
    @TableField(value = "UniqueCode")
    private String UniqueCode;

    //所属企业
    @TableField(value = "CompanyId")
    private String CompanyId;

    //危险源名称
    @TableField(value = "SourceName")
    private String SourceName;

    //R值
    @TableField(value = "RValue")
    private String RValue;

    //危险源等级
    @TableField(value = "Rank")
    private String Rank;

    //备案编号
    @TableField(value = "RecodeNo")
    private String RecodeNo;

    //有效期
    @TableField(value = "Validity")
    private String Validity;

    //状态
    @TableField(value = "Status")
    private String Status;

    //经度
    @TableField(value = "Longt")
    private String Longt;

    //维度
    @TableField(value = "Lat")
    private String Lat;

    //厂区边界外500米范围内人数估值
    @TableField(value = "OutPersonCount")
    private String OutPersonCount;

    //可能引发的事故类型
    @TableField(value = "AccidentType")
    private String AccidentType;

    //可能引发事故死亡人数
    @TableField(value = "DeathToll")
    private String DeathToll;

    //登记日期
    @TableField(value = "RecordDate")
    private String RecordDate;
}
