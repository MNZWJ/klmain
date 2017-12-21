package ax.kl.mapper;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.CompanyArt;
import ax.kl.entity.CompanyInfo;
import ax.kl.entity.DangerSourceInfo;
import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
@Repository
public interface EnterpriseInfoMapper extends BaseMapper<CompanyInfo> {
    /**
     * 获取企业
     * @return
     */
    List<CompanyInfo> getCompanyInfoList(Page page,@Param("companyName") String companyName, @Param("scaleCode") String scaleCode, @Param("typeCode") String typeCode, @Param("industryId")String industryId);
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
     * 通过公司id查询危险源
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
     * 获取待导出的企业信息总数
     * @param companyName
     * @param scaleCode
     * @param typeCode
     * @param industryId
     * @return
     */
    int getExportMajorCount(@Param("companyName") String companyName, @Param("scaleCode") String scaleCode, @Param("typeCode") String typeCode, @Param("industryId")String industryId);

    /**
     * 获取待导出的企业信息列表
     * @param pageIndex
     * @param pageSize
     * @param companyName
     * @param scaleCode
     * @param typeCode
     * @param industryId
     * @return
     */
    List<CompanyInfo> getExportMajor(@Param("pageIndex") int pageIndex,@Param("pageSize") int pageSize, @Param("companyName") String companyName, @Param("scaleCode") String scaleCode, @Param("typeCode") String typeCode, @Param("industryId")String industryId);

}
