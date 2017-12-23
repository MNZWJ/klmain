package ax.kl.service.impl;

import ax.kl.mapper.DangerousAlarmStatisticMapper;
import ax.kl.service.DangerousAlarmStatisticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 8:59 2017/12/19
 * @modified By:
 */
@Service
@Transactional
public class DangerousAlarmStatisticServiceImpl implements DangerousAlarmStatisticService {

    @Autowired
    DangerousAlarmStatisticMapper dangerousAlarmStatisticMapper;
    /**
     * 获取报警类型数量
     *
     * @return
     */
    @Override
    public List<Map<String, String>> getAlarmTypeDay() {
        return dangerousAlarmStatisticMapper.getAlarmTypeDay();
    }

    /**
     * 获取企业报警次数
     *
     * @return
     */
    @Override
    public List<Map<String, String>> getCompanyAlarmData() {
        return dangerousAlarmStatisticMapper.getCompanyAlarmData();
    }

    /**
     * 获取今日设备类型报警数据
     *
     * @return
     */
    @Override
    public List<Map<String, String>> getEquipTypeAlarmToday() {
        return dangerousAlarmStatisticMapper.getEquipTypeAlarmToday();
    }

    /**
     * 获取设备类型
     *
     * @return
     */
    @Override
    public List<Map<String,String>> getEquipTypeList() {
        return dangerousAlarmStatisticMapper.getEquipTypeList();
    }

    /**
     * 获取月度报警类型信息
     */
    @Override
    public List<Map<String, String>> getAlarmTypeMonth() {
        return dangerousAlarmStatisticMapper.getAlarmTypeMonth();
    }

    /**
     * 获取报警类型列表
     *
     * @return
     */
    @Override
    public List<Map<String, String>> getAlarmTypeList() {
        return dangerousAlarmStatisticMapper.getAlarmTypeList();
    }

    /**
     * 获取本月行业报警统计数据
     *
     * @return
     */
    @Override
    public List<Map<String, String>> getIndustryAlarmMonth() {
        return dangerousAlarmStatisticMapper.getIndustryAlarmMonth();
    }

    /**
     * 本月行政区域报警情况统计
     *
     * @return
     */
    @Override
    public List<Map<String, String>> getAreaAlarmMonth() {
        return dangerousAlarmStatisticMapper.getAreaAlarmMonth();
    }

    /**
     * 获取月度报警次数统计
     *
     * @return
     */
    @Override
    public List<Map<String, String>> getMonthAllAlarmCount() {

        List<Map<String, String>> list=dangerousAlarmStatisticMapper.getMonthAllAlarmCount();
        for(int i=list.size()-2;i>=0;i--){

            String alarm=list.get(i).get("alarmCount");
            String lastAlarm=list.get(i+1).get("alarmCount");
            Double proportion=Double.valueOf((Integer.parseInt(alarm)-Integer.parseInt(lastAlarm)))/Integer.parseInt(lastAlarm);

            list.get(i).put("alarmUp",String.format("%.2f",proportion));
        }
        if(list.size()>5){
            list.remove(list.size()-1);
        }


        return list;
    }
}
