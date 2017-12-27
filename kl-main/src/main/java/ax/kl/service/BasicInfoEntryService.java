package ax.kl.service;

import ax.kl.entity.ChemicalCataLog;
import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.CompanyChemical;
import ax.kl.entity.CompanyInfo;
import com.baomidou.mybatisplus.plugins.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * 企业信息录入
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
     * 删除数据
     */
    void delCompanyInfo(String[] idLists);


    /**
     * 验证编码的唯一性
     * @param typeCode
     * @return
     */
    boolean validateTypeCode(String typeCode);

    /**
     * 获取化学品列表
     * @param page
     * @param param
     * @return
     */
    Page<ChemicalCataLog> getChemicalInfoList(Page page, Map<String, String> param);

    /**
     * 通过ID获取公司化学品信息
     * @param companyId
     * @return
     */
    List<CompanyChemical> getChemicalList(String companyId);

    /**
     * 字节流获取Excel数据并插入
     * @param  file
     * @return
     */
    String inputCompanyInfo(MultipartFile file);
}
