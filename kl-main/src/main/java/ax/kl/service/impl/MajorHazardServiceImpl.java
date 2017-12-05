package ax.kl.service.impl;

import ax.kl.entity.MajorHazard;
import ax.kl.mapper.MajorHazardMapper;
import ax.kl.service.MajorHazardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @author wangbiao
 */
@Transactional
@Service
public class MajorHazardServiceImpl implements MajorHazardService {

    @Autowired
    MajorHazardMapper majorHazardMapper;

    /**
     * 获取重大危险源
     *
     * @param CompanyName 所属企业
     * @param SourceName  重大危险源名称
     * @param Rank        危险源级别
     * @return
     */
    @Override
    public List<MajorHazard> getMajorHazard(String CompanyName, String SourceName, String Rank) {
        String filter = "1=1";
//        if ("".equals(CompanyName))
//            filter += " and CompanyName = '" + CompanyName + "'";
//        if ("".equals(SourceName))
//            filter += " and SourceName = '" + SourceName + "'";
//        if ("".equals(Rank))
//            filter += " and Rank = '" + Rank + ",";
//        if ("".equals(CompanyName + SourceName + Rank))
//            filter = "1 = 1";
//        else
//            filter = filter.substring(5);
        return majorHazardMapper.getMorHazar(filter);
    }
}

