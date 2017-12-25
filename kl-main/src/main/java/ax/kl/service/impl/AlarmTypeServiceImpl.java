package ax.kl.service.impl;

import ax.kl.entity.AlarmType;
import ax.kl.entity.EquipInfo;
import ax.kl.entity.ProcessUnit;
import ax.kl.mapper.AlarmTypeMapper;
import ax.kl.mapper.EquipInfoMapper;
import ax.kl.mapper.ProcessUnitMapper;
import ax.kl.service.AlarmTypeService;
import ax.kl.service.ProcessUnitService;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.plugins.Page;
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
public class AlarmTypeServiceImpl implements AlarmTypeService {

    @Autowired
    AlarmTypeMapper alarmTypeMapper;

    @Override
    public String saveOrUpdateData(String cmd) {
        return null;
    }

    @Override
    public boolean validateTypeCode(String typeCode) {
        return false;
    }

    @Override
    public Page<AlarmType> getAlarmTypeList(Page page, String searchName) {
        return null;
    }

    @Override
    public void delAlarmType(String[] idLists) {

    }
}