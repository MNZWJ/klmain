package ax.kl.service;

import ax.kl.entity.CompanyInfo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 16:20 2017/12/4
 * @modified By:
 */

public interface InspectionService {

    /**
     * 获取企业列表
     * @param param
     * @return
     */
    List<CompanyInfo> getCompanyList(Map<String,String> param);

    /**
     * 获取公司信息
     * @param companyInfo
     * @return
     */
    List<CompanyInfo> getCompanyInfo(String companyInfo);

}
