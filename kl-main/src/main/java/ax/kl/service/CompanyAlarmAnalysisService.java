package ax.kl.service;

import java.util.List;
import java.util.Map;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 14:24 2017/12/20
 * @modified By:
 */
public interface CompanyAlarmAnalysisService {


    /**
     * 获取监测点类型
     * @return
     */
    public List<Map<String,String>> getAlarmTypeList();

    /**
     * 获取报警数据
     * @param startDate
     * @param endDate
     * @return
     */
    public List<Map<String,String>> getAlarmNum(String startDate,String endDate,String companyName);

    /**
     * 加载报警数据详情
     * @param pageIndex
     * @param pageSize
     * @param companyCode
     * @param targetCode
     * @return
     */
    Map<String,Object> loadAlarmDataList(int pageIndex,int pageSize,String companyCode,
                                           String targetCode,String startDate,String endDate);
}
