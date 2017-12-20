package ax.kl.mapper;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.DangerSourceInfo;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

/**
 * 重大危险源监控图
 * @author wangbiao
 * Date 2017/12/04
 */
@Repository
public interface DangerSourceMapper {

    /**
     * 获取重大危险源坐标信息
     * @param companyName 企业名称
     * @param sourceName 危险源名称
     * @param rank 危险等级
     * @return 重大危险源坐标
     */
    List<DangerSourceInfo> getSourceCoordinate(@Param("companyName") String companyName, @Param("sourceName") String sourceName, @Param("rank") String rank);

    /**
     * 获取重大危险源坐标信息
     * @param sourceId
     * @return 重大危险源
     */
    DangerSourceInfo getDSourceInfo(@Param("sourceId") String sourceId);

    /**
     * 获取所有重大危险源
     * @return 重大危险源
     */
    List<DangerSourceInfo> getAllDSource();

    /**
     * 获取危险源的化学品信息
     * @param page
     * @param sourceId 危险源Id
     * @return 化学品实体
     */
    List<ChemicalsInfo> getChemicalsInfoListBySourceId(Page page,@Param("sourceId") String sourceId);
    /**
     * 获取危险源的化学品信息
     * @param sourceId 危险源Id
     * @return 化学品实体
     */
    List<ChemicalsInfo> getChemicalsInfoListBySourceId(@Param("sourceId") String sourceId);

    /**
     * 获取重大危险源等级数量
     * @return
     */
    List<Map<String,String>> getSourceRankCount();

    /**
     * 可能引发的事故类型数量
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
