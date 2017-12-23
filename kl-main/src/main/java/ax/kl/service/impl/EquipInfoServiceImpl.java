package ax.kl.service.impl;

import ax.kl.entity.EquipInfo;
import ax.kl.mapper.EquipInfoMapper;
import ax.kl.service.EquipInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 设备信息
 * @author wangkang
 */
@Service
@Transactional
public class EquipInfoServiceImpl implements EquipInfoService {

    @Autowired
    EquipInfoMapper equipInfoMapper;


    /**
     * 设备信息列表
     * @return
     */
    @Override
    public List<EquipInfo> getEquipInfoList(String unitId){

        return equipInfoMapper.getEquipInfoList(unitId);
    }

    /**
     * 验证设备唯一编码是否存在
     * @param uniqueCode
     * @return true 不存在，false 存在
     */
    @Override
    public boolean validateEquipCode(String uniqueCode){
        int num = equipInfoMapper.validateEquipCode(uniqueCode);
        boolean re = num == 0;
        return re;
    };

    /**
     * 增
     * @param equipInfo
     * @return
     */
    @Override
    public int saveEquipInfo(EquipInfo equipInfo){
        String uniqueCode =equipInfo.getUniqueCode();
        int num = equipInfoMapper.validateEquipCode(uniqueCode);
        if (num==0){
            return equipInfoMapper.insertEquipInfo(equipInfo);
        }
        else {
            return equipInfoMapper.updateEquipInfo(equipInfo);
        }
    }

    /**
     * 删
     * @param ids
     * @return
     */
    @Override
    public int deleteEquipInfo(String ids){
        String[] code = ids.split(",");
        return equipInfoMapper.deleteEquipInfo(code);
    };


}
