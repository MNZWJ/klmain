package ax.kl.service;

import ax.kl.entity.DangerSourceInfo;

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
}