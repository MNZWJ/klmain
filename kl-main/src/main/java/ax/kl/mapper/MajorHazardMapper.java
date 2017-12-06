package ax.kl.mapper;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.MajorHazard;
import com.baomidou.mybatisplus.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * 重大危险源监控图
 * @author wangbiao
 * Date 2017/12/04
 */
@Repository
public interface MajorHazardMapper{

    /**
     * 获取重大危险源详细信息
     * @param filter 过滤条件
     * @return 重大危险源实体
     */
    List<MajorHazard> getMorHazar(@Param("filter") String filter);

    /**
     * 获取危险源的化学品信息
     * @param sourceId 危险源Id
     * @return 化学品实体
     */
    List<ChemicalsInfo> getChemicalsInfoListBySourceId(@Param("sourceId") String sourceId);
}
