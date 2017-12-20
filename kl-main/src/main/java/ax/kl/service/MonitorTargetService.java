package ax.kl.service;

import ax.kl.entity.MonitorTarget;
import ax.kl.entity.TreeModel;
import com.baomidou.mybatisplus.plugins.Page;

import java.util.List;

/**
 * 指标维护
 * @author wangbiao
 * Date 2017/12/19
 */
public interface MonitorTargetService {
    /**
     * 获取检测指标树
     * @return
     */
    List<TreeModel> getTargetTree();

    /**
     * 获取检测指标列表
     * @param page
     * @return
     */
    Page<MonitorTarget> getTargetTable(Page page,String pCode);

    /**
     * 验证编码是否存在
     * @param targetCode
     * @return
     */
    boolean validateCode(String targetCode);

    /**
     * 保存设备类型
     * @param monitorTarget
     */
    void saveTarget(MonitorTarget monitorTarget);

    /**
     * 删
     * @param targetCode
     */
    void deleteTarget(String[] targetCode);
}
