package ax.kl.service;

import ax.kl.entity.EquipInfo;
import ax.kl.entity.EquipType;
import ax.kl.entity.TreeModel;
import com.baomidou.mybatisplus.plugins.Page;

import java.util.List;
import java.util.Map;

/**
 * 设备信息
 * @author wangkang
 */
public interface EquipInfoService {


    /**
     * 设备信息列表
     * @return
     */
    List<EquipInfo> getEquipInfoList(String unitId);

    /**
     * 验证设备唯一编码是否存在
     * @param equipCode
     * @return
     */
    boolean validateEquipCode(String equipCode);

    /**
     * 增
     * @param equipInfo
     * @return
     */
    int saveEquipInfo(EquipInfo equipInfo);

    /**
     * 删
     * @param ids
     * @return
     */
    int deleteEquipInfo(String ids);


}
