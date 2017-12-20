package ax.kl.service.impl;

import ax.kl.mapper.CompanyAlarmAnalysisMapper;
import ax.kl.service.CompanyAlarmAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

}
