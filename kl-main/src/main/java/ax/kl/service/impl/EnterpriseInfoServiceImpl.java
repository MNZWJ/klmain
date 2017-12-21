package ax.kl.service.impl;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.CompanyArt;
import ax.kl.entity.CompanyInfo;
import ax.kl.entity.DangerSourceInfo;
import ax.kl.mapper.EnterpriseInfoMapper;
import ax.kl.service.EnterpriseInfoService;
import com.baomidou.mybatisplus.plugins.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
@Transactional
@Service
public class EnterpriseInfoServiceImpl implements EnterpriseInfoService {
    @Autowired
    EnterpriseInfoMapper enterpriseInfoMapper;

    /**
     * 获取企业信息
     * CompanyName 所属企业Id
     * @return
     */
    @Override
    public Page<CompanyInfo> getCompanyInfoList(Page page, String companyName, String scaleCode, String typeCode, String industryId){
        page.setRecords(enterpriseInfoMapper.getCompanyInfoList(page,companyName,scaleCode,typeCode,industryId));
        return page;
    }
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
        return enterpriseInfoMapper.getCompanyList(searchCompanyName,searchIndustryCode,searchScaleCode,searchTypeCode);
    }
    /**
     * 获取公司信息
     * @param companyInfo
     * @return
     */
    @Override
    public List<CompanyInfo> getCompanyInfo(String companyInfo) {
        return enterpriseInfoMapper.getCompanyInfo(companyInfo);
    }

    /**
     * 通过id获取危险源
     * @param companyId
     * @return
     */
    @Override
    public List<DangerSourceInfo> getDangerSourceList(String companyId) {
        return enterpriseInfoMapper.getDangerSourceList(companyId);
    }

    /**
     * 通过id获取化学品信息
     * @param companyId
     * @return
     */
    @Override
    public List<ChemicalsInfo> getChemicalsInfoList(String companyId) {
        return enterpriseInfoMapper.getChemicalsInfoList(companyId);
    }

    /**
     * 通过id加载关联危险化工工艺信息
     * @param companyId
     * @return
     */
    @Override
    public List<CompanyArt> getCompanyArtList(String companyId) {
        return enterpriseInfoMapper.getCompanyArtList(companyId);
    }

    /**
     * 获取待导出的企业信息总数
     * @param companyName
     * @param scaleCode
     * @param typeCode
     * @param industryId
     * @return
     */
    @Override
    public int getExportMajorCount( String companyName, String scaleCode, String typeCode,String industryId){
        return  this.enterpriseInfoMapper.getExportMajorCount(companyName,scaleCode,typeCode,industryId);
    }

    /**
     * 获取待导出的企业信息列表
     * @param pageIndex
     * @param pageSize
     * @param companyName
     * @param scaleCode
     * @param typeCode
     * @param industryId
     * @return
     */
    @Override
    public  List<CompanyInfo> getExportMajor(int pageIndex,int pageSize,String companyName, String scaleCode, String typeCode,String industryId){
        return this.enterpriseInfoMapper.getExportMajor(pageIndex,pageSize,companyName,scaleCode,typeCode,industryId);
    }

}
