package ax.kl.service;

import ax.kl.entity.EquipType;
import ax.kl.entity.TreeModel;
import com.baomidou.mybatisplus.plugins.Page;
import jdk.nashorn.internal.runtime.regexp.joni.constants.StringType;

import java.util.List;
import java.util.Map;

/**
 * 设备类型
 * @author wangbiao
 */
public interface EquipTypeService {

    /**
     * 获取设备类型树
     * @return
     */
    List<TreeModel> getEquipTypeTreeList();

    /**
     * 设备类型列表
     * @param page
     * @param parentId
     * @return
     */
    Page<EquipType> getEquipTypeTable(Page page,String parentId);

    /**
     * 验证设备编码是否存在
     * @param typeCode
     * @return
     */
    boolean validateTypeCode(String typeCode);

    /**
     * 增
     * @param equipType
     * @return
     */
    int saveEquip(EquipType equipType);

    /**
     * 删
     * @param typeCode
     * @return
     */
    int deleteEquip(String typeCode);

    /**
     * 排序
     * @param map
     * @return
     */
    String removeOrder(Map<String,String> map);
}
