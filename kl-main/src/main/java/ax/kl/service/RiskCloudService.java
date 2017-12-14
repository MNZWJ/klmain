package ax.kl.service;

import ax.kl.entity.DangerSourceInfo;
import ax.kl.entity.FacilitiesCondition;
import ax.kl.entity.LegalProtection;
import ax.kl.entity.ProcessUnit;

import java.util.List;
import java.util.Map;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 8:29 2017/12/12
 * @modified By:
 */
public interface RiskCloudService {
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
    public List<ProcessUnit> getProcessUnitData(String sourceId);

    /**
     * 获取周边环境信息
     * @param sourceId
     * @return
     */
    public List<FacilitiesCondition> getConditionList(String sourceId );


    /**
     * 获取法律保护区与信息
     * @param sourceId
     * @return
     */
    public List<LegalProtection> getProtectionList(String sourceId );

}
