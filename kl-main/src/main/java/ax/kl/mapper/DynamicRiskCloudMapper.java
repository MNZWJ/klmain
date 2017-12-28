package ax.kl.mapper;

import ax.kl.entity.AlarmInfoEntity;
import ax.kl.entity.DangerSourceInfo;
import ax.kl.entity.EquipInfo;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 9:10 2017/12/18
 * @modified By:
 */
@Repository
public interface DynamicRiskCloudMapper {
    /**
     * 获取危险源列表
     * @param searchCompanyName
     * @param searchSourceName
     * @param searchRank
     * @param searchRankHidden
     * @return
     */
    public List<DangerSourceInfo> getHazardList(@Param("searchCompanyName")String searchCompanyName, @Param("searchSourceName")String searchSourceName, @Param("searchRank")String searchRank, @Param("searchRankHidden")String searchRankHidden);


    /**
     * 获取工艺单元信息
     * @param sourceId
     * @return
     */
    public List<Map<String,String>> getProcessUnitData(@Param("sourceId")String sourceId);

    /**
     * 获取设备报警信息
     * @param sourceId
     * @return
     */
    public List<EquipInfo> getEquipAlarmInfo(@Param("sourceId")String sourceId);

    /**
     * 获取气体报警信息
     * @param unitId
     * @return
     */
    public List<AlarmInfoEntity> getAilAlarmInfo(String unitId);

    /**
     * 获取气体报警信息
     * @param equipId
     * @return
     */
    public List<AlarmInfoEntity> getEquipAlarm(String equipId);

}
