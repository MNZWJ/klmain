package ax.kl.service.impl;

import ax.kl.entity.CompanyCertificate;
import ax.kl.entity.CompanyInfo;
import ax.kl.entity.RealtimeAlarmData;
import ax.kl.mapper.OverdueAlarmMapper;
import ax.kl.service.OverdueAlarmService;
import com.baomidou.mybatisplus.plugins.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 超期运行预警
 * @author wangbiao
 * Date 2017/12/18
 */
@Service
public class OverdueAlarmServiceImpl implements OverdueAlarmService {
    @Autowired
    OverdueAlarmMapper overdueAlarmMapper;

    /**
     * 获取企业预警信息
     * @return
     */
    @Override
    public List<CompanyInfo> getAlarmCompanyList(Map<String,String> map){
        String searchCompanyName = "";
        String searchScaleCode = "";
        String searchTypeCode = "";
        String searchAlarm = "";
        if (map.containsKey("searchCompanyName")){
            searchCompanyName = map.get("searchCompanyName");
        }
        if (map.containsKey("searchScaleCode")){
            searchScaleCode = map.get("searchScaleCode");
        }
        if (map.containsKey("searchTypeCode")){
            searchTypeCode = map.get("searchTypeCode");
        }
        if (map.containsKey("searchAlarm")){
            searchAlarm = map.get("searchAlarm");
        }
        return overdueAlarmMapper.getAlarmCompanyList(searchCompanyName,searchScaleCode,searchTypeCode,searchAlarm);
    }
    /**
     * 获取已超期证书列表
     * @param companyId
     * @return
     */
    @Override
    public List<CompanyCertificate> getCertificateAlarm(String companyId){
        return overdueAlarmMapper.getCertificateAlarm(companyId);
    };

    /**
     * 获取实时报警列表
     * @param companyId
     * @return
     */
    @Override
    public List<RealtimeAlarmData> getRealtimeAlarm(String companyId){
        return overdueAlarmMapper.getRealtimeAlarm(companyId);
    };
}
