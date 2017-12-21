package ax.kl.mapper;

import ax.kl.entity.MonitorTarget;
import ax.kl.entity.TreeModel;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 检测指标维护
 * @author wangbiao
 */
@Repository
public interface MonitorTargetMapper {
    /**
     * 获取检测指标树
     * @return
     */
    List<TreeModel> getTargetTree();

    /**
     * 获取检测指标列表
     * @return
     */
    List<MonitorTarget> getTargetTable(Page page,@Param("pCode") String pCode);

    /**
     * 验证编码是否存在
     * @param targetCode
     * @return
     */
    int validateCode(@Param("targetCode")String targetCode);

    /**
     * 增
     * @param monitorTarget
     * @return
     */
    int insertTarget(MonitorTarget monitorTarget);

    /**
     * 改
     * @param monitorTarget
     * @return
     */
    int updateTarget(MonitorTarget monitorTarget);

    /**
     * 删
     * @param targetCode
     * @return
     */
    int deleteTarget(String[] targetCode);
}
