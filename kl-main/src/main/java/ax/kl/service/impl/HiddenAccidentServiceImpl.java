package ax.kl.service.impl;

import ax.kl.entity.HiddenAccident;
import ax.kl.entity.DangerSourceInfo;
import ax.kl.mapper.HiddenAccidentMapper;
import ax.kl.service.HiddenAccidentService;
import com.baomidou.mybatisplus.plugins.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 9:56 2017/12/6
 * @modified By:
 */
@Transactional
@Service
public class HiddenAccidentServiceImpl implements HiddenAccidentService {

    @Autowired
    HiddenAccidentMapper hiddenAccidentMapper;

    @Override
    public List<DangerSourceInfo> getHazardList(Map<String,String> param) {
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


        return  hiddenAccidentMapper.getHazardList(searchCompanyName,searchSourceName,searchRank,searchRankHidden);
    }

    @Override
    public Page<HiddenAccident> getHiddenInfo(Page page, String sourceId) {
        page.setRecords(hiddenAccidentMapper.getHiddenInfo(page,sourceId));
        return page;
    }
}
