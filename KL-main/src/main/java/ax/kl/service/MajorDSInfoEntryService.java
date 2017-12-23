package ax.kl.service;

import ax.kl.entity.*;
import com.baomidou.mybatisplus.plugins.Page;

import java.util.List;
import java.util.Map;

/**
 * 重大危险源信息录入
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
public interface MajorDSInfoEntryService {

    /**
     * 通过ID获取危险源信息
     * @param sourceId
     * @return
     */
    List<DangerSourceInfo> getSourceInfo(String sourceId);

    /**
     * 通过id获取装置设施周围环境
     * @param sourceId
     * @return
     */
    List<FacilitiesCondition> getSourceEquipList(String sourceId);

    /**
     * 通过id获取法律保护区信息
     * @param sourceId
     * @return
     */
    List<LegalProtection> getSourceLegalList(String sourceId);

    /**
     * 删除数据
     */
    void delSourceInfo(String[] idLists);

    /**
     * 保存信息
     */
    String saveOrUpdateData(String cmd);


    /**
     * 通过ID获取危险源化学品信息
     * @param sourceId
     * @return
     */
    List<CompanyChemical> getChemicalList(String sourceId);

    /**
     * 获取化学品列表
     * @param page
     * @param param
     * @return
     */
    Page<ChemicalCataLog> getChemicalInfoByCompany(Page page, Map<String, String> param);

}
