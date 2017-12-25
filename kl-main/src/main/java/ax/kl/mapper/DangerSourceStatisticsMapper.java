package ax.kl.mapper;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface DangerSourceStatisticsMapper {

    /**
     * 近五年重大危险源数量统计折线
     * @return
     */
    List<Map<String,Object>> getFiveYearCountInfo(@Param("year0")String year0,@Param("year1")String year1,
                                                  @Param("year2")String year2,@Param("year3")String year3,
                                                  @Param("year4")String year4);

    /**
     * 近五年重大危险源数量统计柱状图
     * @return
     */
    List<Map<String,String>> getFiveYearCountbarInfo(@Param("year0")String year0,@Param("year1")String year1,
                                                     @Param("year2")String year2,@Param("year3")String year3,
                                                     @Param("year4")String year4);

    /**
     * 近五年重大危险源可能引发事故类型统计折线
     * @return
     */
    List<Map<String,Object>> getFiveYearAccitentTypeScale(@Param("year0")String year0,@Param("year1")String year1,
                                                          @Param("year2")String year2,@Param("year3")String year3,
                                                          @Param("year4")String year4);

    /**
     * 可能引起的事故类型占比
     * @return
     */
    List<Map<String,String>> getDSAccidenTypeScale(@Param("rank")String rank);

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
    List<Map<String,String>> getRankAndAccenTypeAreaInfo(@Param("typeId")String typeId);

    /**
     * 重大危险源引发事故死亡人数统计
     * @return
     */
    List<Map<String,Integer>> getDeathTollInfo();
}
