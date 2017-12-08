package ax.kl.service;

import ax.kl.entity.ChemicalsInfo;
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
    Page<ChemicalsInfo> getChemicalsList(Page page, Map<String, String> param);
}
