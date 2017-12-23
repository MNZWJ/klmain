package ax.kl.service.impl;

import ax.kl.entity.DangerSourceInfo;
import ax.kl.entity.EquipInfo;
import ax.kl.mapper.DynamicRiskCloudMapper;
import ax.kl.service.DynamicRiskCloudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 9:13 2017/12/18
 * @modified By:
 */
@Service
@Transactional
public class DynamicRiskCloudServiceImpl implements DynamicRiskCloudService {

    @Autowired
    DynamicRiskCloudMapper dynamicRiskCloudMapper;

    /**
     * 加载危险源列表
     *
     * @param param
     * @return
     */
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

        List<DangerSourceInfo> sourceInfoList=dynamicRiskCloudMapper.getHazardList(searchCompanyName,searchSourceName,searchRank,searchRankHidden);

        sourceInfoList.forEach(s->{
            if(s.getMajorHidden()>0||s.getRiskWarn()>0){
                s.setColorFlag("1");
            }else if((s.getGeneralHidden()>0)){
                s.setColorFlag("2");
            }else {
                s.setColorFlag("4");
            }


        });
        return sourceInfoList;
    }

    /**
     * 获取工艺单元信息
     *
     * @param sourceId
     * @return
     */
    @Override
    public List<Map<String,String>> getProcessUnitData(String sourceId) {
        return dynamicRiskCloudMapper.getProcessUnitData(sourceId);
    }

    /**
     * 获取设备报警信息
     *
     * @param sourceId
     * @return
     */
    @Override
    public Map<String, List<EquipInfo>> getEquipAlarmInfo(String sourceId) {

        List<EquipInfo> equipList=dynamicRiskCloudMapper.getEquipAlarmInfo(sourceId);

        Map<String,List<EquipInfo>> map=equipList.stream().collect(Collectors.groupingBy(EquipInfo::getUnitId));

        return map;
    }


}
