package ax.kl.entity;

import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import lombok.Data;

import java.util.List;

/**
 * @Author: SuZhenpeng
 * Description:
 * Date: Created in 9:05 2017/11/14
 * @Modified By:
 */
@Data
public class TreeModel {
    /**
     * 树节点文本
     */
    @TableField("text")
    private String text;

    /**
     * id
     */
    @TableId("id")
    private String id;

    /**
     * 树子节点数组
     */
    @TableField("nodes")
    private List<TreeModel> nodes;

    /**
     * 父节点id
     */
    @TableField("parentId")
    private String parentId;

    /**
     * 编码
     */
    @TableField("code")
    private String code;

    /**
     * 图标
     */
    @TableField(value = "icon",exist = false)
    private String icon;

    @TableField(value = "image",exist = false)
    private String image;
}
