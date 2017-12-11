package ax.kl.service.impl;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.DangerSourceInfo;
import ax.kl.mapper.DangerSourceMapper;
import ax.kl.service.DangerSourceService;
import com.baomidou.mybatisplus.plugins.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 重大危险源
 * @author wangbiao
 * Date 2017/12/04
 */
@Service
public class DangerSourceServiceImpl implements DangerSourceService {

    @Autowired
    DangerSourceMapper dangerSourceMapper;

    /**
     * 获取重大危险源
     * CompanyName 所属企业Id
     * SourceName  重大危险源名称
     * Rank        危险源级别
     * @return
     */
    @Override
    public List<DangerSourceInfo> getSourceCoordinate(Map<String, String> param) {
        return dangerSourceMapper.getSourceCoordinate(param.get("companyName"),param.get("sourceName"),param.get("rank"));
    }

    /**
     * 获取重大危险源
     * CompanyName 所属企业Id
     * SourceName  重大危险源名称
     * Rank        危险源级别
     * @return
     */
    @Override
    public DangerSourceInfo getDSourceInfo(String sourceId) {
        return dangerSourceMapper.getDSourceInfo(sourceId);
    }

    /**
     * 获取重大危险源关联化学品
     * 分页
     * @param sourceId 危险源Id
     * @return
     */
    @Override
    public Page<ChemicalsInfo> getChemicalsInfoListBySourceId(Page page,String sourceId) {
        page.setRecords(dangerSourceMapper.getChemicalsInfoListBySourceId(page,sourceId));
        return page;
    }

    ;    /**
     * 获取重大危险源关联化学品
     * @param sourceId 危险源Id
     * @return
     */
    @Override
    public List<ChemicalsInfo> getChemicalsInfoListBySourceId(String sourceId) {
        return dangerSourceMapper.getChemicalsInfoListBySourceId(sourceId);
    }
}

