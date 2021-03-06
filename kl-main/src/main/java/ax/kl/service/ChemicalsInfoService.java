package ax.kl.service;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.CompanyChemical;
import com.baomidou.mybatisplus.plugins.Page;

import java.util.List;
import java.util.Map;

/**
 * 化学品信息
 * @author wangbiao
 * Date 2017/12/07
 */
public interface ChemicalsInfoService {
    /**
     * 获取化学品列表
     * @param page
     * @param param
     * @return
     */
    Page<CompanyChemical> getChemicalsList(Page page, Map<String, String> param);

    /**
     * 获取待导出的化学品信息总数
     * @param chemName
     * @param companyName
     * @return
     */
    int getExportMajorCount(String chemName, String companyName);

    /**
     * 获取待导出的化学品信息列表
     * @param chemName
     * @param companyName
     * @return
     */
    List<CompanyChemical> getExportMajor(int pageIndex, int pageSize, String chemName, String companyName);
}