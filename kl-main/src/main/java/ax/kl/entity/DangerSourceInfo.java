package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import lombok.Data;

/**
 * 重大危险源信息
 * @author wangbiao
 * Date 2017/12/04
 */
@Data
@TableName("TB_BASE_DANGERSOURCE_INFO")
public class DangerSourceInfo {


    /**主键*/
    @TableId(value = "SourceId")
    private String sourceId;

    /**唯一编码*/
    @TableField(value = "UniqueCode")
    private String uniqueCode;

    /**所属企业*/
    @TableField(value = "CompanyId")
    private String companyId;

    /**危险源名称*/
    @TableField(value = "SourceName")
    private String sourceName;

    /**R值*/
    @TableField(value = "RValue")
    private String rValue;

    /**危险源等级*/
    @TableField(value = "Rank")
    private String rank;

    /**备案编号*/
    @TableField(value = "RecordNo")
    private String recordNo;

    /**有效期*/
    @TableField(value = "Validity")
    private String validity;

    /**状态*/
    @TableField(value = "Status")
    private String status;

    /**经度*/
    @TableField(value = "Longt")
    private String longt;

    /**维度*/
    @TableField(value = "Lat")
    private String lat;

    /**厂区边界外500米范围内人数估值*/
    @TableField(value = "OutPersonCount")
    private String outPersonCount;

    /**可能引发的事故类型*/
    @TableField(value = "AccidentType")
    private String accidentType;

    /**可能引发事故死亡人数*/
    @TableField(value = "DeathToll")
    private String deathToll;

    /**登记日期*/
    @TableField(value = "RecordDate")
    private String recordDate;
    /**
     * 隐患条数
     */
    @TableField(value = "num")
    private String num;

    /**
     * 装置设施环境不符合个数
     */
    @TableField("ConditionFlag")
    private long conditionFlag;

    /**
     * 法律保护区不符合个数
     */
    @TableField("ProtectionFlag")
    private long protectionFlag;
    /**
     * 工艺单元火灾爆炸指数（已计算）
     */
    @TableField("UnitNum")
    private double UnitNum;

    /**
     * 危险颜色等级
     */
    @TableField("colorFlag")
    private String colorFlag;

    /**
     * 重大隐患数量
     */
    @TableField("MajorHidden")
    private long majorHidden;

    /**
     * 一般隐患数量
     */
    @TableField("GeneralHidden")
    private long generalHidden;

    /**
     * 报警数量
     */
    @TableField("RiskWarn")
    private long riskWarn;


}
