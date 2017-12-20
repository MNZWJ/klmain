package ax.kl.service;

import ax.kl.entity.CompanyInfo;

import java.util.List;

/**
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
public interface BasicInfoEntryService {
    /**
     * 新增或更新企业信息
     */
    String saveOrUpdateData(String cmd);

    /**
     * 通过ID获取公司信息
     * @param companyId
     * @return
     */
    List<CompanyInfo> getCompanyInfo(String companyId);

    /**
     * 通过ID获取公司证书信息
     * @param companyId
     * @return
     */
    List<CompanyInfo> getCompanyCertList(String companyId);



    /**
     * 删除人员
     */
    void delCompanyInfo(String[] idLists);


    /**
     * 验证编码的唯一性
     * @param typeCode
     * @return
     */
    boolean validateTypeCode(String typeCode);
}
