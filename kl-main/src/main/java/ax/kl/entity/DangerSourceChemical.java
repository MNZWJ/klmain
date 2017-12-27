package ax.kl.entity;

import com.alibaba.fastjson.annotation.JSONField;
import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import lombok.Data;

/**
 * 化学物品与危险源联系，用于存储TB_REL_DRESOURCE_CHEMICAL表中数据
 */
@Data
@TableName("TB_REL_DRESOURCE_CHEMICAL")
public class DangerSourceChemical {
    /**
     *主键
     */
    @TableId("RelId")
    @JSONField(name = "RelId")
    private String relId;

    /**
     * 危险源Id
     */
    @TableField("SourceId")
    @JSONField(name = "SourceId")
    private String sourceId;

    /**
     * 化学物品Id
     */
    @TableField("ChemId")
    @JSONField(name = "ChemId")
    private String chemId;

    /**
     * 化学品含量
     */
    @TableField("Dreserves")
    @JSONField(name = "Dreserves")
    private Double dreserves;

    /**
     * 单位
     */
    @TableField("Unit")
    @JSONField(name = "Unit")
    private String unit;

}
