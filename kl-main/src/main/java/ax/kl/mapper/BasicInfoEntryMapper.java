package ax.kl.mapper;

import ax.kl.entity.CompanyInfo;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 基本信息录入
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
@Repository
public interface BasicInfoEntryMapper {

    /**
     * 新增企业信息
     */
    int  saveData( CompanyInfo form);

    /**
     * 更新企业信息
     */
    int updateData(CompanyInfo form);

    /**
     * 保存企业行业信息
     * @param IndustryCode
     * @param companyId
     */
    void  saveQYHYData(@Param("industry") String[] IndustryCode, @Param("companyId")String companyId);


    /**
     * 保存危险工艺单元
     * @param processTable
     * @param companyId
     * @return
     */
    void saveProcessData(@Param("processTable")List<CompanyInfo> processTable, @Param("companyId")String companyId);



    /**
     * 保存证书
     * @param certTable
     * @param companyId
     * @return
     */
    void saveCertData(@Param("certTable") List<CompanyInfo> certTable,@Param("companyId")String companyId);

    /**
     * 通过ID获取公司信息
     * @param companyId
     * @return
     */
    List<CompanyInfo> getCompanyInfo(@Param("companyId") String companyId);

    /**
     * 通过ID获取公司证书信息
     * @param companyId
     * @return
     */
    List<CompanyInfo> getCompanyCertList(@Param("companyId") String companyId);

    /**
     * 删除数据
     */
    void delCompanyInfo(String[] idLists);

}
