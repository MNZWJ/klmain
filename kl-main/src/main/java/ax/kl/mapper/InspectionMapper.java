package ax.kl.mapper;


import ax.kl.entity.*;
import com.baomidou.mybatisplus.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

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
    List<CompanyInfo> getCompanyList(@Param("searchCompanyName") String searchCompanyName,@Param("searchIndustryCode") String[] searchIndustryCode,@Param("searchScaleCode") String searchScaleCode,@Param("searchTypeCode")String searchTypeCode);

    /**
     * 获取公司信息
     * @param companyId
     * @return
     */
    List<CompanyInfo> getCompanyInfo(@Param("companyId") String companyId);

    /**
     * 通过公司id查询企业
     * @param companyId
     * @return
     */
    List<DangerSourceInfo> getDangerSourceList(@Param("companyId") String companyId);

    /**
     * 获取企业下的化学品信息
     * @param companyId
     * @return
     */
    List<ChemicalsInfo> getChemicalsInfoList(@Param("companyId") String companyId);


    /**
     * 加载危险化学工艺
     * @param companyId
     * @return
     */
    List<CompanyArt> getCompanyArtList(@Param("companyId")String companyId);


    /**
     * 获取企业行业分布情况
     * @return
     */
    List<IndustryCompanyInfo> getIndustryCompanyInfo();

    /**
     * 获取企业类型
     * @return
     */
    List<Map<String,String>> getCompanyTypeData();

    /**
     * 加载企业规模数据
     * @return
     */
    List<Map<String,String>> getScaleCodeData();

    /**
     * 获取企业行政分布情况
     * @return
     */
    List<IndustryCompanyInfo> getCompanyDirectAirData();

}
