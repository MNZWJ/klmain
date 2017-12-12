package ax.kl.service.impl;

import ax.kl.entity.DangerSourceInfo;
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
        return riskCloudMapper.getHazardList(searchCompanyName,searchSourceName,searchRank,searchRankHidden);
    }
}
