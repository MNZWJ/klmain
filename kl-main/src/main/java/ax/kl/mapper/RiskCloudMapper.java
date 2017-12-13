package ax.kl.mapper;

import ax.kl.entity.DangerSourceInfo;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 8:25 2017/12/12
 * @modified By:
 */
@Repository
public interface RiskCloudMapper {

    /**
     * 获取危险源列表
     * @param searchCompanyName
     * @param searchSourceName
     * @param searchRank
     * @param searchRankHidden
     * @return
     */
    public List<DangerSourceInfo> getHazardList(@Param("searchCompanyName")String searchCompanyName, @Param("searchSourceName")String searchSourceName, @Param("searchRank")String searchRank, @Param("searchRankHidden")String searchRankHidden);

}
