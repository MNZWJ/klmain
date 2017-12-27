package ax.kl.service.impl;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.DangerSourceChemical;
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
     * 获取所有重大危险源
     * @return 重大危险源
     */
    @Override
    public List<DangerSourceInfo> getAllDSource(){
        return this.dangerSourceMapper.getAllDSource();
    }

    /**
     * 获取重大危险源关联化学品
     * @param sourceId 危险源Id
     * @return
     */
    @Override
    public List<DangerSourceChemical> getChemicalsInfoListBySourceId(String sourceId) {
        return dangerSourceMapper.getChemicalsInfoListBySourceId(sourceId);
    }

    /**
     * 获取重大危险源等级数量
     * @return
     */
    @Override
    public List<Map<String,String>> getSourceRankCount(){
        return dangerSourceMapper.getSourceRankCount();
    }

    /**
     * 可能引发的事故类型数量
     * @return
     */
    @Override
    public List<Map<String,String>> getDSAccidenType(String typeId){
        return dangerSourceMapper.getDSAccidenType(typeId);
    }

    /**
     * 重大危险源分布情况
     * @return
     */
    @Override
    public List<Map<String,String>> getDSDistribution(){
        return dangerSourceMapper.getDSDistribution();
    }

    /**
     * 各行业重大危险源分布情况
     * @return
     */
    @Override
    public List<Map<String,String>> getDSIndustry(){
        return dangerSourceMapper.getDSIndustry();
    };

}

