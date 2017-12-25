package ax.kl.service;

import ax.kl.entity.ChemicalCataLog;
import ax.kl.entity.ChemicalsInfo;
import com.baomidou.mybatisplus.plugins.Page;

import java.util.List;
import java.util.Map;

/**
 * 化学品信息展示
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
public interface ChemicalsCataLogService {

    /**
     * 获取化学品列表
     * @param page
     * @param param
     * @return
     */
    Page<ChemicalCataLog> getChemicalCataLogInfoList(Page page, Map<String, String> param);
    /**
     * 获取待导出的化学品信息总数
     * @param chemName
     * @param cas
     * @return
     */
    int getExportMajorCount(String chemName, String cas);

    /**
     * 获取待导出的化学品信息列表
     * @param chemName
     * @param cas
     * @return
     */
    List<ChemicalCataLog> getExportMajor(int pageIndex, int pageSize, String chemName, String cas);
}