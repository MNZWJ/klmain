package ax.kl.service;

import ax.kl.entity.DangerSourceInfo;

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
}
