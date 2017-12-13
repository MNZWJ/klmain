package ax.kl.mapper;

import ax.kl.entity.HiddenAccident;
import ax.kl.entity.DangerSourceInfo;
import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;


import java.util.List;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 9:28 2017/12/6
 * @modified By:
 */
@Repository
public interface HiddenAccidentMapper extends BaseMapper<DangerSourceInfo> {


    /**
     * 获取危险源列表
     * @param searchCompanyName
     * @param searchSourceName
     * @param searchRank
     * @param searchRankHidden
     * @return
     */
    public List<DangerSourceInfo> getHazardList(@Param("searchCompanyName")String searchCompanyName, @Param("searchSourceName")String searchSourceName, @Param("searchRank")String searchRank, @Param("searchRankHidden")String searchRankHidden);

    /**
     * 获取隐患信息
     * @param sourceId
     * @return
     */
    List<HiddenAccident> getHiddenInfo(Page page, @Param("sourceId")String sourceId,@Param("searchName")String searchName);

}
