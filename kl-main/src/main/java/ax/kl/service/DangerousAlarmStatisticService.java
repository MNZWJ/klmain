package ax.kl.service;

import java.util.List;
import java.util.Map;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 8:58 2017/12/19
 * @modified By:
 */
public interface DangerousAlarmStatisticService {

    /**
     * 获取报警类型数量
     * @return
     */
    public List<Map<String,String>> getAlarmTypeDay();

    /**
     * 获取企业报警次数
     * @return
     */
    public List<Map<String,String>> getCompanyAlarmData();


    /**
     * 获取今日设备类型报警数据
     * @return
     */
    public List<Map<String,String>> getEquipTypeAlarmToday();

    /**
     * 获取设备类型
     * @return
     */
    public List<Map<String,String>> getEquipTypeList();


    /**
     * 获取月度报警类型信息
     */
    public List<Map<String,String>> getAlarmTypeMonth();


    /**
     * 获取报警类型列表
     * @return
     */
    public List<Map<String,String>> getAlarmTypeList();

    /**
     * 获取本月行业报警统计数据
     * @return
     */
    public List<Map<String,String>> getIndustryAlarmMonth(String staticIndustryStr);

    /**
     * 本月行政区域报警情况统计
     * @return
     */
    public List<Map<String,String>> getAreaAlarmMonth();

    /**
     * 获取月度报警次数统计
     * @return
     */
    public List<Map<String,String>> getMonthAllAlarmCount();

}
