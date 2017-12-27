package ax.kl.service.impl;

import ax.kl.mapper.MonthStatisMapper;
import ax.kl.service.MonthStatisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 月度数据统计
 * @author Created by xum
 * @version 创建时间：${date} ${time}
 */
@Transactional
@Service
public class MonthStatisServiceImpl implements MonthStatisService {

    @Autowired
    MonthStatisMapper MonthStatisMapper;

    /**
     * 统计月度数据
     */
    public  void statisMonthData(){

        //每日报警统计
        this.MonthStatisMapper.totalDayAlarm();

        //企业每日报警统计
        this.MonthStatisMapper.totalCompanyDayAlarm();

        //区域报警统计
        List<Map<String,String>> areaDataList = this.MonthStatisMapper.getAreaAlarmData();
        //更新区域报警数据
        this.MonthStatisMapper.UpdateAreaAlarmData(areaDataList);
        //插入区域报警数据
        this.MonthStatisMapper.insertAreaAlarmData();

        //行业报警统计
        List<Map<String,String>> industryList = this.MonthStatisMapper.getIndustryAlarmData();
        //更新行业报警统计数据
        this.MonthStatisMapper.UpdateIndustryAlarmData(industryList);
        //插入行业报警统计数据
        this.MonthStatisMapper.insertIndustryAlarmData();

        //清空表
        this.MonthStatisMapper.truncTable();
    }

}