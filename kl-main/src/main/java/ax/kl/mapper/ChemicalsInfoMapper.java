package ax.kl.mapper;

import ax.kl.entity.ChemicalsInfo;
import ax.kl.entity.CompanyChemical;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 化学品信息
 * @author wangbiao
 * Date 2017/12/07
 */
@Repository
public interface ChemicalsInfoMapper {

    /**
     * 获取化学品列表
     *
     * @param page        分页
     * @param chemName    化学品名称
     * @param companyName 企业名称
     * @return
     */
    List<CompanyChemical> getChemicalsList(Page page, @Param("chemName") String chemName, @Param("companyName") String companyName);

    /**
     * 获取待导出的化学品信息总数
     * @param chemName
     * @param companyName
     * @return
     */
    int getExportMajorCount(@Param("chemName") String chemName,  @Param("companyName") String companyName);

    /**
     * 获取待导出的化学品信息表
     * @param pageIndex
     * @param pageSize
     * @param chemName
     * @param companyName
     * @return
     */
    List<CompanyChemical> getExportMajor(@Param("pageIndex") int pageIndex, @Param("pageSize") int pageSize,
                                         @Param("chemName") String chemName, @Param("companyName") String companyName);


}
