package ax.kl.service.impl;

import ax.kl.entity.*;
import ax.kl.mapper.InspectionMapper;
import ax.kl.service.InspectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 16:21 2017/12/4
 * @modified By:
 */
@Service
@Transactional
public class InspectionServiceImpl implements InspectionService {

    @Autowired
    InspectionMapper inspectionMapper;
    /**
     * 获取企业集合
     * @return
     */
    @Override
    public List<CompanyInfo> getCompanyList(Map<String,String> param){
        String searchCompanyName="";
        String[] searchIndustryCode={};
        String searchScaleCode="";
        String searchTypeCode="";
        if(param.containsKey("searchCompanyName")){
            searchCompanyName=param.get("searchCompanyName");
        }
        if(param.containsKey("searchIndustryCode")){
            String  searchIndustryCodeStr=param.get("searchIndustryCode");
            if(searchIndustryCodeStr.length()>0){
                searchIndustryCode=searchIndustryCodeStr.split(",");
            }

        }
        if(param.containsKey("searchScaleCode")){
            searchScaleCode=param.get("searchScaleCode");
        }
        if(param.containsKey("searchTypeCode")){
            searchTypeCode=param.get("searchTypeCode");
        }


        return inspectionMapper.getCompanyList(searchCompanyName,searchIndustryCode,searchScaleCode,searchTypeCode);
    }

    /**
     * 获取公司信息
     * @param companyInfo
     * @return
     */
    @Override
    public List<CompanyInfo> getCompanyInfo(String companyInfo) {
        return inspectionMapper.getCompanyInfo(companyInfo);
    }

    @Override
    public List<MajorHazard> getDangerSourceList(String companyId) {
        return inspectionMapper.getDangerSourceList(companyId);
    }

    @Override
    public List<ChemicalsInfo> getChemicalsInfoList(String companyId) {
        return inspectionMapper.getChemicalsInfoList(companyId);
    }

    @Override
    public List<CompanyArt> getCompanyArtList(String companyId) {
        return inspectionMapper.getCompanyArtList(companyId);
    }

    @Override
    public List<IndustryCompanyInfo> getIndustryCompanyInfo() {
        return inspectionMapper.getIndustryCompanyInfo();
    }
}
