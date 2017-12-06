package ax.kl.mapper;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.MajorHazard;
import com.baomidou.mybatisplus.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MajorHazardMapper{

    /**
     *
     * @param filter 过滤条件
     * @return
     */
    List<MajorHazard> getMorHazar(@Param("filter") String filter);

    /**
     * 获取危险源的化学品信息
     * @param sourceId 危险源Id
     * @return
     */
    List<ChemicalsInfo> getChemicalsInfoListBySourceId(@Param("sourceId") String sourceId);
}
