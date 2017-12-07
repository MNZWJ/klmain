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
 * 重大危险源
 * @author wangbiao
 * Date 2017/12/04
 */
@Service
public class MajorHazardServiceImpl implements MajorHazardService {

    @Autowired
    MajorHazardMapper majorHazardMapper;

    /**
     * 获取重大危险源
     * CompanyName 所属企业Id
     * SourceName  重大危险源名称
     * Rank        危险源级别
     * @return
     */
    @Override
    public List<MajorHazard> getMajorHazard(Map<String, String> param) {
        return majorHazardMapper.getMorHazar(param.get("companyName"),param.get("sourceName"),param.get("rank"),param.get("sourceId"));
    }

    /**
     * 获取重大危险源关联化学品
     * @param sourceId 危险源Id
     * @return
     */
    @Override
    public List<ChemicalsInfo> getChemicalsInfoListBySourceId(String sourceId) {
        return majorHazardMapper.getChemicalsInfoListBySourceId(sourceId);
    }

    ;
}

