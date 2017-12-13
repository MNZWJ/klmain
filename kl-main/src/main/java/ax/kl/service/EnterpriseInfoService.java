package ax.kl.service;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.CompanyArt;
import ax.kl.entity.CompanyInfo;
import ax.kl.entity.DangerSourceInfo;
import com.baomidou.mybatisplus.plugins.Page;

import java.util.List;
import java.util.Map;

/**
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
public interface EnterpriseInfoService {
    /**
     * 获取企业信息列表
     * @param
     * @return
     */
    Page<CompanyInfo> getCompanyInfoList(Page page, String companyName,  String scaleCode, String typeCode, String industryId);
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
     * 获取待导出的企业信息总数
     * @param companyName
     * @param scaleCode
     * @param typeCode
     * @param industryId
     * @return
     */
    int getExportMajorCount(String companyName, String scaleCode, String typeCode,String industryId);

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
    List<CompanyInfo> getExportMajor(int pageIndex,int pageSize,String companyName, String scaleCode, String typeCode,String industryId);
}
