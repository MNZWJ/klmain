package ax.kl.service;

import ax.kl.entity.HiddenAccident;
import ax.kl.entity.DangerSourceInfo;
import com.baomidou.mybatisplus.plugins.Page;

import java.util.List;
import java.util.Map;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 9:54 2017/12/6
 * @modified By:
 */
public interface HiddenAccidentService {

    /**
     * 加载危险源列表
     * @return
     */
    List<DangerSourceInfo> getHazardList(Map<String,String> param);

    /**
     * 加载隐患信息
     * @param sourceId
     * @return
     */
    Page<HiddenAccident> getHiddenInfo(Page page,String sourceId);

}
