package ax.kl.mapper;

import ax.kl.entity.CompanyInfo;
import com.baomidou.mybatisplus.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author: ZhenpengSu
 * @description:
 * @date: Created in 16:11 2017/12/4
 * @modified By:
 */
@Repository
public interface InspectionMapper extends BaseMapper<CompanyInfo> {

    /**
     * 获取企业
     * @return
     */
    List<CompanyInfo> getCompanyList(@Param("searchCompanyName") String searchCompanyName,@Param("searchIndustryCode") String searchIndustryCode,@Param("searchScaleCode") String searchScaleCode);

    /**
     * 获取公司信息
     * @param companyId
     * @return
     */
    List<CompanyInfo> getCompanyInfo(@Param("companyId") String companyId);

}
