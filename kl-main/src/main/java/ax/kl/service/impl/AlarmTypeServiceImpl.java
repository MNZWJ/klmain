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
        JSONObject jsstr = JSONObject.parseObject(cmd);
        AlarmType alarm=(AlarmType)JSONObject.toJavaObject(jsstr.getJSONObject("alarm"),AlarmType.class);
        String flag=jsstr.getString("flag");
        if(flag.equals("add")){
            this.alarmTypeMapper.insertAlarmType(alarm);
            return alarm.getTypeCode();
        }else{
            this.alarmTypeMapper.updateAlarmType(alarm);
        }

        return "";
    }

    @Override
    public boolean validateTypeCode(String typeCode) {
        int count=alarmTypeMapper.validateTypeCode(typeCode);
        return count==0;
    }

    @Override
    public Page<AlarmType> getAlarmTypeList(Page page, String searchName) {
        page.setRecords(alarmTypeMapper.getAlarmTypeList(page,searchName));
        return page;
    }

    @Override
    public void delAlarmType(String[] idLists) {
        alarmTypeMapper.delAlarmType(idLists);
    }
}