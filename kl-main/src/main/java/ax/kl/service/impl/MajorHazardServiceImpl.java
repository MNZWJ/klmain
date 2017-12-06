package ax.kl.service.impl;

import ax.kl.entity.ChemicalsInfo;
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
        StringBuffer filter = new StringBuffer("1 = 1");
        for (Map.Entry<String, String> entry : param.entrySet()) {
            if("".equals(entry.getValue()))
                continue;
            else if(entry.getKey().equals("companyName"))
                filter.append(" AND c.companyName like '%").append(entry.getValue()).append("%'");
            else if(entry.getKey().equals("sourceName"))
                filter.append(" AND d.sourceName like '%").append(entry.getValue()).append("%'");
            else if(entry.getKey().equals("area"))
                filter.append(" AND c.area like '%").append(entry.getValue()).append("%'");
            else
                filter.append(" AND d.").append(entry.getKey()).append(" = '").append(entry.getValue()).append("'");
        }
        return majorHazardMapper.getMorHazar(filter.toString());
    }

    /**
     * 获取重大危险源关联化学品
     * @param sourceId
     * @return
     */
    @Override
    public List<ChemicalsInfo> getChemicalsInfoListBySourceId(String sourceId){
        return majorHazardMapper.getChemicalsInfoListBySourceId(sourceId);
    };
}

