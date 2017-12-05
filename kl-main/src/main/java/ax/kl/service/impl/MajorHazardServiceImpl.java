package ax.kl.service.impl;

import ax.kl.entity.MajorHazard;
import ax.kl.mapper.MajorHazardMapper;
import ax.kl.service.MajorHazardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

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
     * <p>
     * CompanyName 所属企业Id
     * SourceName  重大危险源名称
     * Rank        危险源级别
     *
     * @return
     */
    @Override
    public List<MajorHazard> getMajorHazard(Map<String, String> param) {
        StringBuffer filter = new StringBuffer("1=1");
        if (param.containsKey("companyName")&&!param.get("companyName").equals("")) {
            filter.append(" and c.CompanyName like '%").append(param.get("companyName")).append("%'");
        }
        if (param.containsKey("sourceName")&&!param.get("sourceName").equals("")) {
            filter.append(" and d.SourceId='").append(param.get("sourceName")).append("'");
        }
        if (param.containsKey("rank")&&!param.get("rank").equals("")) {
            filter.append(" and d.Rank='").append(param.get("rank")).append("'");
        }
        return majorHazardMapper.getMorHazar(filter.toString());
    }
}

