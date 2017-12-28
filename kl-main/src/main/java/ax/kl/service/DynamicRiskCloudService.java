package ax.kl.service;

import ax.kl.entity.AlarmInfoEntity;
import ax.kl.entity.DangerSourceInfo;
import ax.kl.entity.EquipInfo;

import java.util.List;
import java.util.Map;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 9:12 2017/12/18
 * @modified By:
 */
public interface DynamicRiskCloudService {
    /**
     * 加载危险源列表
     * @return
     */
    List<DangerSourceInfo> getHazardList(Map<String,String> param);

    /**
     * 获取工艺单元信息
     * @param sourceId
     * @return
     */
    public List<Map<String,String>> getProcessUnitData(String sourceId);


    /**
     * 获取设备报警信息
     * @param sourceId
     * @return
     */
    public Map<String,List<EquipInfo>> getEquipAlarmInfo(String sourceId);

    /**
     * 获取气体报警信息
     * @param unitId
     * @return
     */
    public List<AlarmInfoEntity> getAilAlarmInfo(String unitId);

    /**
     * 获取单个设备报警信息
     * @param equipId
     * @return
     */
    public List<AlarmInfoEntity> getEquipAlarm(String equipId);

}
