package ax.kl.mapper;

import ax.kl.entity.*;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

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
     * 保存企业化学品
     * @param chemicalTable
     * @param companyId
     */
    void saveChemicalData(@Param("chemicalTable")List<CompanyChemical> chemicalTable, @Param("companyId")String companyId);

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

    /**
     * 验证编码的唯一性
     * @param typeCode
     * @return
     */
    int validateTypeCode(@Param("typeCode")String typeCode);

    /**
     * 获取化学品列表
     *
     * @param page        分页
     * @param chemName    化学品名称
     * @param   cas
     * @return
     */
    List<ChemicalCataLog> getChemicalInfoList(Page page, @Param("chemName") String chemName, @Param("cas") String cas);

    /**
     * 通过ID获取公司化学品信息
     * @param companyId
     * @return
     */
    List<CompanyChemical> getChemicalList(@Param("companyId") String companyId);

    /**
     * 获取企业信息
     * @return
     */
    List<Map<String,String>> getCompanyForName();

    /**
     * 插入企业信息
     * @param list
     * @return
     */
    int insertCompanyInfo(@Param("list")List<CompanyInfo> list);

    /**
     * 插入企业行业
     * @param hylist
     * @return
     */
    int insertCompanyIndustry(@Param("hylist")List<CompanyInfo> hylist);

    /**
     * 插入企业化工工艺信息
     * @param list1
     * @return
     */
    int insertCompanyTechnology(@Param("list1")List<CompanyInfo> list1);

    /**
     * 插入企业证书信息
     * @param list2
     * @return
     */
    int insertCompanyCert(@Param("list2")List<CompanyInfo> list2);

    /**
     * 插入企业化学品信息
     * @param list3
     * @return
     */
    int insertCompanyChemical(@Param("list3")List<CompanyChemical> list3);

    /**
     * 获取数据字典
     * @return
     */
    List<Map<String,String>> getDictListForName();


    /**
     * 获取化学品数据
     * @return
     */
    List<Map<String,String>> getChemicalListForName();

}
