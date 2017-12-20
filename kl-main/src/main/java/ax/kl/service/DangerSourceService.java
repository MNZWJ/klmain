package ax.kl.service;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.DangerSourceInfo;
import com.baomidou.mybatisplus.plugins.Page;

import java.util.List;
import java.util.Map;

/**
 * 重大危险源
 * @author wangbiao
 * Date 2017/12/04
 */
public interface DangerSourceService {

    /**
     * 获取重大危险源坐标
     * @param param 过滤条件
     * @return
     */
    List<DangerSourceInfo> getSourceCoordinate(Map<String,String> param);

    /**
     * 获取重大危险源详细信息
     * @param sourceId
     * @return
     */
    DangerSourceInfo getDSourceInfo(String sourceId);

    /**
     * 获取重大危险源关联化学品
     * @param sourceId
     * @return
     */
    List<ChemicalsInfo> getChemicalsInfoListBySourceId(String sourceId);

    /**
     * 获取重大危险源等级数量
     * @return
     */
    List<Map<String,String>> getSourceRankCount();

    /**
     * 获得重大危险源可能引发的事故类型数量
     * @return
     */
    List<Map<String,String>> getDSAccidenType();

    /**
     * 重大危险源分布情况
     * @return
     */
    List<Map<String,String>> getDSDistribution();

    /**
     * 各行业重大危险源分布情况
     * @return
     */
    List<Map<String,String>> getDSIndustry();
}
