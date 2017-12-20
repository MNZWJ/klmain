package ax.kl.mapper;

import ax.kl.entity.HiddenAccident;
import ax.kl.entity.DangerSourceInfo;
import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Map;

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

    /**
     * 获取所有隐患信息 无过滤-分页
     * @param page
     * @return
     */
    List<HiddenAccident> getHiddenAllInfo(@Param("page") Page page,
                                          @Param("dangerSource")String dangerSource,
                                          @Param("hiddenDanger")String hiddenDanger,
                                          @Param("rank") String rank,
                                          @Param("rectification")String rectification,
                                          @Param("startdate")String startdate,
                                          @Param("enddate")String enddate);

    /**
     * 获取重大危险源信息
     * @return
     */
    List<Map<String,String>> getSourceForName();

    /**
     * 插入事故隐患
     * @param list
     * @return
     */
    int insertHiddenDanger(@Param("list")List<HiddenAccident> list);
}

