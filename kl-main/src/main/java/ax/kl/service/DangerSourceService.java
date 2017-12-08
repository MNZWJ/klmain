package ax.kl.service;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.DangerSourceInfo;
import com.baomidou.mybatisplus.plugins.Page;

import java.util.List;
import java.util.Map;

/**
 * 重大危险源
 * @author wangbiao
 * Date 2017/12/04
 */
public interface DangerSourceService {

    /**
     * 获取重大危险源坐标
     * @param param 过滤条件
     * @return
     */
    List<DangerSourceInfo> getSourceCoordinate(Map<String,String> param);

    /**
     * 获取重大危险源详细信息
     * @param sourceId
     * @return
     */
    DangerSourceInfo getDSourceInfo(String sourceId);

    /**
     * 获取重大危险源关联化学品
     * @param page
     * @param sourceId
     * @return
     */
    Page<ChemicalsInfo> getChemicalsInfoListBySourceId(Page page,String sourceId);
}
