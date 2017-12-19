package ax.kl.service.impl;

import ax.kl.common.TreeUtil;
import ax.kl.entity.MonitorTarget;
import ax.kl.entity.TreeModel;
import ax.kl.mapper.MonitorTargetMapper;
import ax.kl.service.MonitorTargetService;
import com.baomidou.mybatisplus.plugins.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 指标维护
 * @author wangbiao
 */
@Transactional
@Service
public class MonitorTargetServiceImpl implements MonitorTargetService {

    @Autowired
    MonitorTargetMapper monitorTargetMapper;
    /**
     * 获取检测指标树
     * @return
     */
    @Override
    public List<TreeModel> getTargetTree(){
        return TreeUtil.getTree(monitorTargetMapper.getTargetTree());
    };

    /**
     * 获取检测指标列表
     * @return
     */
    @Override
    public Page<MonitorTarget> getTargetTable(Page page,String pCode){
        page.setRecords(monitorTargetMapper.getTargetTable(page,pCode));
        return page;
    }

    /**
     * 验证编码是否存在
     * @param targetCode
     * @return
     */
    @Override
    public boolean validateCode(String targetCode){
        return 0==monitorTargetMapper.validateCode(targetCode);
    };

    /**
     * 保存
     * @param monitorTarget
     */
    @Override
    public void saveTarget(MonitorTarget monitorTarget){
        String targetCode =monitorTarget.getTargetCode();
        if (validateCode(targetCode)){
            monitorTargetMapper.insertTarget(monitorTarget);
        }else {
            monitorTargetMapper.updateTarget(monitorTarget);
        }
    }

    /**
     * 删
     * @param targetCode
     */
    @Override
    public void deleteTarget(String[] targetCode){
        monitorTargetMapper.deleteTarget(targetCode);
    }
}
