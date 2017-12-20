package ax.kl.service.impl;

import ax.kl.entity.ProcessUnit;
import ax.kl.mapper.ProcessUnitMapper;
import ax.kl.service.ProcessUnitService;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * 工艺单元
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
@Transactional
@Service
public class ProcessUnitServiceImpl implements ProcessUnitService {
    @Autowired
    ProcessUnitMapper processUnitMapper;

    /**
     * 新增或更新工艺单元信息，添加就返回UUID码,参数是一个json字符串
     */
    public String saveOrUpdateData(ProcessUnit processUnit){
        if ("".equals(processUnit.getUnitId()) || processUnit.getUnitId() == null) {
            String unitId = UUID.randomUUID().toString();
            processUnit.setUnitId(unitId);
            this.processUnitMapper.insertUnit(processUnit);
            return unitId;
        } else {
            this.processUnitMapper.updateUnit(processUnit);
            return "";
        }
    }

    /**
     * 通过名称获取工艺单元信息
     * @param searchName
     * @return
     */
    public Page<ProcessUnit> getProcessUnitList(Page page, String searchName){
        page.setRecords(this.processUnitMapper.getProcessUnitList(page,searchName));
        return page;
    }

    /**
     * 删除工艺单元信息
     */
    public void delProcessUnit(String[] idLists){
        this.processUnitMapper.delProcessUnit(idLists);

    }

}
