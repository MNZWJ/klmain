package ax.kl.mapper;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 14:25 2017/12/20
 * @modified By:
 */
@Repository
public interface CompanyAlarmAnalysisMapper {

    /**
     * 获取监测点类型
     * @return
     */
    public List<Map<String,String>> getAlarmTypeList();

    /**
     * 获取报警数据
     * @return
     */
    public List<Map<String,String>> getAlarmNum(@Param("startDate")String startDate,@Param("endDate") String endDate,@Param("companyName")String companyName);

}
