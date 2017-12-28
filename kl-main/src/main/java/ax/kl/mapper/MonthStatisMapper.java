package ax.kl.mapper;

import ax.kl.entity.AlarmType;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * 月度数据的统计--每晚12点
 * @author Created by xum
 * @version 创建时间：${date} ${time}
 */
@Repository
public interface MonthStatisMapper {

    /**
     *每日报警统计--报警类型
     */
    void totalDayAlarm();

    /**
     * 企业每日报警统计
     */
    void totalCompanyDayAlarm();

    /**
     * 获取区域报警统计数据
     * @return
     */
    List<Map<String,String>> getAreaAlarmData();

    /**
     * 更新区域报警数据
     * @param list
     */
    void UpdateAreaAlarmData(List<Map<String,String>> list);

    /**
     * 插入区域报警数据
     */
    void insertAreaAlarmData();

    /**
     * 获取行业报警统计数据
     * @return
     */
    List<Map<String,String>> getIndustryAlarmData();

    /**
     * 更新行业报警统计数据
     */
    void UpdateIndustryAlarmData(List<Map<String,String>> list);

    /**
     * 插入行业报警统计数据
     */
    void insertIndustryAlarmData();

    /**
     * 清空表
     */
    void truncTable();
}
