package ax.kl.service.impl;

import ax.kl.common.TreeUtil;
import ax.kl.entity.EquipType;
import ax.kl.entity.TreeModel;
import ax.kl.mapper.EquipTypeMapper;
import ax.kl.service.EquipTypeService;
import com.baomidou.mybatisplus.plugins.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 设备类型
 * @author wangbiao
 */
@Service
@Transactional
public class EquipTypeServiceImpl implements EquipTypeService{

    @Autowired
    EquipTypeMapper equipTypeMapper;

    /**
     * 设备类型树
     * @return
     */
    @Override
    public List<TreeModel> getEquipTypeTreeList(){
        return TreeUtil.getTree(equipTypeMapper.getEquipTypeTreeList());
    }

    /**
     * 设备类型列表
     * @param page
     * @param parentId
     * @return
     */
    @Override
    public Page<EquipType> getEquipTypeTable(Page page,String parentId){
        page.setRecords(equipTypeMapper.getEquipTypeTable(page,parentId));
        return page;
    }

    /**
     * 验证设备编码是否存在
     * @param typeCode
     * @return true 不存在，false 存在
     */
    @Override
    public boolean validateTypeCode(String typeCode){
        int num = equipTypeMapper.validateTypeCode(typeCode);
        boolean re = num == 0;
        return re;
    };

    /**
     * 增
     * @param equipType
     * @return
     */
    @Override
    public int saveEquip(EquipType equipType){
        String typeCode =equipType.getTypeCode();
        int num = equipTypeMapper.validateTypeCode(typeCode);
        if (num==0){
        equipType.setTypeOrder(Integer.toString(equipTypeMapper.getMaxOrder()));
            return equipTypeMapper.insertEquip(equipType);
        }
        else {
            return equipTypeMapper.updateEquip(equipType.getTypeName(),typeCode);
        }
    }

    /**
     * 删
     * @param typeCode
     * @return
     */
    @Override
    public int deleteEquip(String typeCode){
        String[] code = typeCode.split(",");
        return equipTypeMapper.deleteEquip(code);
    };

    /**
     * 排序
     * @param map
     * @return
     */
    @Override
    public String removeOrder(Map<String,String> map){
        List<EquipType> list =new ArrayList<>();
        String typeCode = map.get("typeCode");
        String typeOrder = map.get("typeOrder");
        String pCode = map.get("pCode");
        if ("up".equals(map.get("type"))){
            list=equipTypeMapper.getUpdate(typeOrder,pCode);
            if (list.size()==0){
                return "1";
            }
        }else {
            list =equipTypeMapper.getDowndate(typeOrder,pCode);
            if (list.size()==0){
                return "2";
            }
        }
        EquipType equipType=list.get(0);
        equipTypeMapper.upDateOrderSort(typeCode,equipType.getTypeOrder(),
                equipType.getTypeCode(),map.get("typeOrder"));
        return "0";
    };

    /**
     * 设备类型
     * @return
     */
    @Override
    public List<Map<String,String>> getEquipType(){
        return equipTypeMapper.getEquipType();
    };
}
