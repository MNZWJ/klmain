package ax.kl.service.impl;

import ax.kl.mapper.CompanyAlarmAnalysisMapper;
import ax.kl.service.CompanyAlarmAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 14:25 2017/12/20
 * @modified By:
 */
@Service
@Transactional
public class CompanyAlarmAnalysisServiceImpl implements CompanyAlarmAnalysisService{

    @Autowired
    CompanyAlarmAnalysisMapper companyAlarmAnalysisMapper;

    /**
     * 获取监测点类型
     *
     * @return
     */
    @Override
    public List<Map<String, String>> getAlarmTypeList() {
        return companyAlarmAnalysisMapper.getAlarmTypeList();
    }

    /**
     * 获取报警数据
     *
     * @param startDate
     * @param endDate
     * @return
     */
    @Override
    public List<Map<String, String>> getAlarmNum(String startDate, String endDate,String companyName) {
        return companyAlarmAnalysisMapper.getAlarmNum(startDate,endDate,companyName);
    }
}
