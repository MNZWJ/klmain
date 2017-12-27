package ax.kl.entity;

import com.alibaba.fastjson.annotation.JSONField;
import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import lombok.Data;

/**
 * 事故类型与危险源联系，用于存储TB_REL_DRESOURCE_ACCIDENTYPE表中数据
 */
@Data
@TableName("TB_REL_DRESOURCE_ACCIDENTYPE")
public class AccidentType {
    /**
     *主键
     */
    @TableId("RelationId")
    @JSONField(name = "RelationId")
    private String relationId;

    /**
     * 危险源Id
     */
    @TableField("SourceId")
    @JSONField(name = "SourceId")
    private String sourceId;

    /**
     * 事故类型Id
     */
    @TableField("TypeId")
    @JSONField(name = "TypeId")
    private String typeId;

}
