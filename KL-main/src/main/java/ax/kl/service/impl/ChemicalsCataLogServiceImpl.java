package ax.kl.service.impl;

import ax.kl.entity.ChemicalCataLog;
import ax.kl.entity.ChemicalsInfo;
import ax.kl.mapper.ChemicalsCataLogMapper;
import ax.kl.service.ChemicalsCataLogService;
import com.baomidou.mybatisplus.plugins.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * 化学品信息展示
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
@Transactional
@Service
public class ChemicalsCataLogServiceImpl implements ChemicalsCataLogService {

    @Autowired
    ChemicalsCataLogMapper chemicalsCataLogMapper;
    /**
     * 获取化学品列表
     * @param param 过滤条件
     * @return
     */
    @Override
    public Page<ChemicalCataLog> getChemicalCataLogInfoList(Page page, Map<String, String> param) {
        page.setRecords(chemicalsCataLogMapper.getChemicalCataLogInfoList(page,param.get("chemName"),param.get("cas")));
        return page;
    }
    /**
     * 获取待导出的化学品信息总数
     * @param chemName
     * @param cas
     * @return
     */
    @Override
    public int getExportMajorCount( String chemName, String cas){
        return  this.chemicalsCataLogMapper.getExportMajorCount(chemName,cas);
    }

    /**
     * 获取待导出的化学品信息列表
     * @param chemName
     * @param cas
     * @return
     */
    @Override
    public List<ChemicalCataLog> getExportMajor(int pageIndex, int pageSize, String chemName, String cas){
        return this.chemicalsCataLogMapper.getExportMajor(pageIndex,pageSize,chemName,cas);
    }
}
