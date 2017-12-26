package ax.kl.service;

import java.util.List;
import java.util.Map;

/**
 * 重大危险源统计
 * @author wangbiao
 */
public interface DangerSourceStatisticsService {

    /**
     * 近五年重大危险源数量统计
     * @return
     */
    List<Map<String,Object>> getFiveYearCountInfo();

    /**
     * 近五年重大危险源数量统计柱状图
     * @return
     */
    List<Map<String,String>> getFiveYearCountbarInfo();

    /**
     * 近五年重大危险源可能引发事故类型统计折线
     * @return
     */
    List<Map<String,Object>> getFiveYearAccitentTypeScale();

    /**
     * 危险源涉及的存储设备类型占比
     * @return
     */
    List<Map<String,String>> getDSAccidenEquip(String typeId);

    /**
     * 安全标准化级别占比
     * @return
     */
    List<Map<String,String>> getStandardRankScale();

    /**
     * 重大危险源级别和可能引发事故类型的区域分布
     * @param typeId
     * @return
     */
    List<Map<String,String>> getRankAndAccenTypeAreaInfo(String typeId);

    /**
     * 重大危险源引发事故死亡人数统计
     * @return
     */
    List<Map<String,Object>> getDeathTollInfo();
}
