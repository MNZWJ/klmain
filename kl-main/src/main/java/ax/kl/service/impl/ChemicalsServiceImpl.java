package ax.kl.service.impl;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.mapper.ChemicalsInfoMapper;
import ax.kl.service.ChemicalsInfoService;
import org.apache.xmlbeans.impl.xb.xsdschema.Public;
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
    public java.util.List<ChemicalsInfo> getChemicalsList(Map<String,String> param) {
        return chemicalsInfoMapper.getChemicalsList(param.get("chemName"),param.get("equipName"),param.get("companyName"));
    }
}
