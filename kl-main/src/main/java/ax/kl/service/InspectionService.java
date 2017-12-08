package ax.kl.service;


import ax.kl.entity.*;



import java.util.List;
import java.util.Map;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 16:20 2017/12/4
 * @modified By:
 */

public interface InspectionService {

    /**
     * 获取企业列表
     * @param param
     * @return
     */
    List<CompanyInfo> getCompanyList(Map<String,String> param);

    /**
     * 获取公司信息
     * @param companyInfo
     * @return
     */
    List<CompanyInfo> getCompanyInfo(String companyInfo);

    /**
     * 通过公司Id查询危险源
     * @param companyId
     * @return
     */
    List<DangerSourceInfo> getDangerSourceList(String companyId);

    /**
     * 获取企业下的化学品信息
     * @param companyId
     * @return
     */
    List<ChemicalsInfo> getChemicalsInfoList(String companyId);

    /**
     * 加载危险化学工艺
     * @param companyId
     * @return
     */
    List<CompanyArt> getCompanyArtList(String companyId);


    /**
     * 获取企业行业分布情况
     * @return
     */
    List<IndustryCompanyInfo> getIndustryCompanyInfo();

}
