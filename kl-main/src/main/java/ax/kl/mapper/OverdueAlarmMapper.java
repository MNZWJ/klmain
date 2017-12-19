package ax.kl.mapper;

import ax.kl.entity.CompanyCertificate;
import ax.kl.entity.CompanyInfo;
import ax.kl.entity.RealtimeAlarmData;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 超期运行预警
 * @author wangbiao
 * Date 2017/12/18
 */
@Repository
public interface OverdueAlarmMapper {
    /**
     * 获取企业预警集合
     * @return
     */
    List<CompanyInfo> getAlarmCompanyList(@Param("searchCompanyName") String searchCompanyName,
                                          @Param("searchScaleCode") String searchScaleCode,
                                          @Param("searchTypeCode") String searchTypeCode,
                                          @Param("searchAlarm") String searchAlarm);

    /**
     * 获取已超期证书列表
     * @param companyId
     * @return
     */
    List<CompanyCertificate> getCertificateAlarm(@Param("companyId") String companyId);

    /**
     * 获取实时报警列表
     * @param companyId
     * @return
     */
    List<RealtimeAlarmData> getRealtimeAlarm(@Param("companyId") String companyId);
}
