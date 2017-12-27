package ax.kl.service;

import ax.kl.entity.CompanyCertificate;
import ax.kl.entity.CompanyInfo;
import ax.kl.entity.RealtimeAlarmData;
import com.baomidou.mybatisplus.plugins.Page;

import java.util.List;
import java.util.Map;

/**
 * 超期运行预警
 * @author wangbiao
 * Date 2017/12/18
 */
public interface OverdueAlarmService {

    /**
     * 获取企业预警信息
     * @return
     */
    List<CompanyInfo> getAlarmCompanyList(Map<String,String> map);

    /**
     * 获取已超期证书列表
     * @param companyId
     * @return
     */
    List<CompanyCertificate> getCertificateAlarm(String companyId);

    /**
     * 获取实时报警列表
     * @param companyId
     * @return
     */
    List<RealtimeAlarmData> getRealtimeAlarm(String companyId);
}
