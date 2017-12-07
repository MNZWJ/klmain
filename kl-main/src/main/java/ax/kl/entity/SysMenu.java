package ax.kl.entity;

import com.alibaba.fastjson.annotation.JSONField;
import com.baomidou.mybatisplus.annotations.TableField;
import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import lombok.Data;

/**
 * @Author: SuZhenpeng
 * Description:
 * Date: Created in 10:10 2017/11/13
 * @Modified By:
 */
@Data
@TableName("TB_SYS_MENUS")
public class SysMenu {


    /**
     * ID
     */
    @TableId("MenuId")
    @JSONField(name = "MenuId")
    private String MenuId;
    @TableField("ParentMenuId")
    @JSONField(name = "ParentMenuId")
    private String ParentMenuId;
    @TableField("URL")
    @JSONField(name = "URL")
    private String URL;
    @TableField("MenuName")
    @JSONField(name = "MenuName")
    private String MenuName;

    @TableField("MenuOrder")
    @JSONField(name = "MenuOrder")
    private String MenuOrder;
    @TableField("MenuLevel")
    @JSONField(name = "MenuLevel")
    private String MenuLevel;

}
