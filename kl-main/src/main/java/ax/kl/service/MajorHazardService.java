package ax.kl.service;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.MajorHazard;
import java.util.List;
import java.util.Map;

/**
 * 重大危险源
 * @author wangbiao
 * Date 2017/12/04
 */
public interface MajorHazardService {

    /**
     * 获取重大危险源
     * @param param 过滤条件
     * @return
     */
    List<MajorHazard> getMajorHazard(Map<String,String> param);

    /**
     * 获取重大危险源关联化学品
     * @param sourceId
     * @return
     */
    List<ChemicalsInfo> getChemicalsInfoListBySourceId(String sourceId);
}
