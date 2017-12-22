package ax.kl.service;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.MonitorData;
import com.baomidou.mybatisplus.plugins.Page;

import java.util.List;
import java.util.Map;

/**
 * 化学品信息
 * @author wangbiao
 * Date 2017/12/07
 */
public interface MHistoryDataService {
    void insertData();

    void insertMonitorData();

    /**
     * 查询展示监测数据
     * @param pageIndex
     * @param pageSize
     * @param companyCode
     * @param resourceCode
     * @param unitCode
     * @param equipCode
     * @param targetCode
     * @param startDate
     * @param endDate
     * @return
     */
    Map<String,Object> loadMonitorDataList(int pageIndex,int pageSize,String companyCode,String resourceCode,
                                           String unitCode,String equipCode,String targetCode,String startDate,
                                           String endDate);

    /**
     * 获取企业下拉框
     * @return
     */
    public Map<String,Map<String,String>> getCompanyDict();

    /**
     * 获取重大危险源下拉框
     * @return
     */
    public Map<String,Map<String,String>> getDresourceDict(String companyCode);

    /**
     * 获取工艺单元下拉框
     * @return
     */
    public Map<String,Map<String,String>> getUnitDict(String dresourceCode);

    /**
     * 获取设备下拉框
     * @return
     */
    public Map<String,Map<String,String>> getEquipDict(String unitCode);

    /**
     * 获取指标下拉框
     * @return
     */
    public Map<String,Map<String,String>> getTargetDict();

}