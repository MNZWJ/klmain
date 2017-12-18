package ax.kl.mapper;

import ax.kl.entity.EquipType;
import ax.kl.entity.TreeModel;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * 设备类型mapper
 * @author wangbiao
 */
@Repository
public interface EquipTypeMapper {

    /**
     * 获取设备类型树
     * @return
     */
    List<TreeModel> getEquipTypeTreeList();

    /**
     * 设备类型列表
     * @param parentId
     * @return
     */
    List<EquipType> getEquipTypeTable(@Param("parentId")String parentId);

    /**
     * 验证设备编码存在
     * @param typeCode
     * @return
     */
    int validateTypeCode(@Param("typeCode")String typeCode);

    /**
     * 增
     * @param equipType
     * @return
     */
    int insertEquip(EquipType equipType);

    /**
     * 改
     * @param typeName
     * @param typeCode
     * @return
     */
    int updateEquip(@Param("typeName")String typeName,@Param("typeCode")String typeCode);

    /**
     * 删
     * @param typeCode
     * @return
     */
    int deleteEquip(String[] typeCode);

    /**
     * 获取排序序号
     * @return
     */
    int getMaxOrder();

    /**
     * 上一条数据
     * @param typeOrder
     * @return
     */
    List<EquipType> getUpdate(@Param("typeOrder")String typeOrder,@Param("pCode")String pCode);

    /**
     * 下一条数据
     * @param typeOrder
     * @return
     */
    List<EquipType> getDowndate(@Param("typeOrder")String typeOrder,@Param("pCode")String pCode);

    /**
     * 排序
     * @param typeCode1
     * @param typeOrder1
     * @param typeCode2
     * @param typeOrder2
     * @return
     */
    int upDateOrderSort(@Param("typeCode1")String typeCode1,@Param("typeOrder1")String typeOrder1,
    @Param("typeCode2")String typeCode2,@Param("typeOrder2")String typeOrder2);
}
