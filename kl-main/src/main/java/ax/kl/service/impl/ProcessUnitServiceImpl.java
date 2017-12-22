package ax.kl.service.impl;

import ax.kl.entity.EquipInfo;
import ax.kl.entity.ProcessUnit;
import ax.kl.mapper.EquipInfoMapper;
import ax.kl.mapper.ProcessUnitMapper;
import ax.kl.service.ProcessUnitService;
import com.alibaba.fastjson.JSONObject;
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

    @Autowired
    EquipInfoMapper equipInfoMapper;

    /**
     * 新增或更新工艺单元信息，添加就返回UUID码,参数是一个json字符串
     */
    public String saveOrUpdateData(String cmd){
        JSONObject jsstr = JSONObject.parseObject(cmd);
        ProcessUnit processUnit=(ProcessUnit)JSONObject.toJavaObject(jsstr.getJSONObject("unit"),ProcessUnit.class);
        List<EquipInfo> equipInfos=(List<EquipInfo>)JSONObject.parseArray(jsstr.getString("equipInfoTable"),EquipInfo.class);
        String deleteIds=jsstr.getString("deleteIds").toString();
        if(!"".equals(deleteIds) || deleteIds != null){
            //删除设备
            this.equipInfoMapper.deleteEquipInfo(deleteIds.split(","));
        }

        if ("".equals(processUnit.getUnitId()) || processUnit.getUnitId() == null) {
            String unitId = UUID.randomUUID().toString();
            processUnit.setUnitId(unitId);
            this.processUnitMapper.insertUnit(processUnit);
            //添加设备信息
            if(equipInfos.size()!=0){
                for(EquipInfo e:equipInfos){
                    e.setEquipId(UUID.randomUUID().toString());
                    e.setUnitId(unitId);
                    this.equipInfoMapper.insertEquipInfo(e);
                }
            }
            return unitId;
        } else {
            this.processUnitMapper.updateUnit(processUnit);
            if(equipInfos.size()!=0){
                for(EquipInfo e:equipInfos){
                    if ("".equals(e.getEquipId()) || e.getEquipId()== null) {
                        e.setEquipId(UUID.randomUUID().toString());
                        e.setUnitId(processUnit.getUnitId());
                        this.equipInfoMapper.insertEquipInfo(e);
                    }else{
                        this.equipInfoMapper.updateEquipInfo(e);
                    }
                }
            }
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
