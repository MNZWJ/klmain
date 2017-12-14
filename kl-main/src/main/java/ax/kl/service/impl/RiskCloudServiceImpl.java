package ax.kl.service.impl;

import ax.kl.common.ConstantData;
import ax.kl.entity.DangerSourceInfo;
import ax.kl.entity.FacilitiesCondition;
import ax.kl.entity.LegalProtection;
import ax.kl.entity.ProcessUnit;
import ax.kl.mapper.RiskCloudMapper;
import ax.kl.service.RiskCloudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 8:28 2017/12/12
 * @modified By:
 */
@Service
@Transactional
public class RiskCloudServiceImpl implements RiskCloudService {

    @Autowired
    RiskCloudMapper riskCloudMapper;
    @Override
    public List<DangerSourceInfo> getHazardList(Map<String, String> param) {
        String searchCompanyName="";
        String searchSourceName="";
        String searchRank="";
        String searchRankHidden="";

        if(param.containsKey("searchCompanyName")){
            searchCompanyName=param.get("searchCompanyName");
        }
        if(param.containsKey("searchSourceName")){
            searchSourceName=param.get("searchSourceName");
        }
        if(param.containsKey("searchRank")){
            searchRank=param.get("searchRank");
        }
        if(param.containsKey("searchRankHidden")){
            searchRankHidden=param.get("searchRankHidden");
        }

        List<DangerSourceInfo> sourceInfoList=riskCloudMapper.getHazardList(searchCompanyName,searchSourceName,searchRank,searchRankHidden);

        sourceInfoList.forEach(s->{
            if(ConstantData.SourceDangerIdOne.equals(s.getRank())||s.getConditionFlag()>0||s.getProtectionFlag()>0||s.getUnitNum()>=159){
                s.setColorFlag("1");
            }else if(ConstantData.SourceDangerIdTwo.equals(s.getRank())||(s.getUnitNum()>=128&&s.getUnitNum()<=158)){
                s.setColorFlag("2");
            }else if(ConstantData.SourceDangerIdThree.equals(s.getRank())||(s.getUnitNum()>=97&&s.getUnitNum()<=127)){
                s.setColorFlag("3");
            }else if(ConstantData.SourceDangerIdFour.equals(s.getRank())||s.getUnitNum()<=97){
                s.setColorFlag("4");
            }


        });


        return sourceInfoList;
    }

    @Override
    public List<ProcessUnit> getProcessUnitData(String sourceId) {
        return riskCloudMapper.getProcessUnitData(sourceId);
    }

    /**
     * 获取周边环境信息
     *
     * @param sourceId
     * @return
     */
    @Override
    public List<FacilitiesCondition> getConditionList(String sourceId) {
        return riskCloudMapper.getConditionList(sourceId);
    }

    /**
     * 获取法律保护区与信息
     *
     * @param sourceId
     * @return
     */
    @Override
    public List<LegalProtection> getProtectionList(String sourceId) {
        return riskCloudMapper.getProtectionList(sourceId);
    }
}
