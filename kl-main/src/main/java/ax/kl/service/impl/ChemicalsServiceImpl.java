package ax.kl.service.impl;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.DangerSourceInfo;
import ax.kl.mapper.ChemicalsInfoMapper;
import ax.kl.service.ChemicalsInfoService;
import com.baomidou.mybatisplus.plugins.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * 化学品信息
 * @author wangbiao
 * Data 2017/12/07
 */
@Transactional
@Service
public class ChemicalsServiceImpl implements ChemicalsInfoService {

    @Autowired
    ChemicalsInfoMapper chemicalsInfoMapper;

    /**
     * 获取化学品列表
     * @param param 过滤条件
     * @return
     */
    @Override
    public Page<ChemicalsInfo> getChemicalsList(Page page,Map<String, String> param) {
        page.setRecords(chemicalsInfoMapper.getChemicalsList(page,param.get("chemName"),param.get("equipName"),param.get("companyName")));
        return page;
    }

    /**
     * 获取待导出的化学品信息总数
     * @param chemName
     * @param equipName
     * @param companyName
     * @return
     */
    @Override
    public int getExportMajorCount( String chemName, String equipName, String companyName){
        return  this.chemicalsInfoMapper.getExportMajorCount(chemName,equipName,companyName);
    }

    /**
     * 获取待导出的化学品信息列表
     * @param chemName
     * @param equipName
     * @param companyName
     * @return
     */
    @Override
    public List<ChemicalsInfo> getExportMajor(int pageIndex, int pageSize, String chemName, String equipName, String companyName){
        return this.chemicalsInfoMapper.getExportMajor(pageIndex,pageSize,chemName,equipName,companyName);
    }
}
