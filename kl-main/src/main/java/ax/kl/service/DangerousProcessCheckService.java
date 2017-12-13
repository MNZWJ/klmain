package ax.kl.service;

import ax.kl.entity.CompanyInfo;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 危险化工工艺
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
public interface DangerousProcessCheckService {

    /**
     * 获取危险化学品工艺
     * @param
     * @return
     */
    Page<CompanyInfo> getProcessList(Page page, @Param("companyName") String companyName, @Param("risk") String risk);
    /**
     * 获取待导出的危险化工工艺总数
     * @param companyName
     * @param risk
     * @return
     */
    int getExportMajorCount(String companyName, String risk);

    /**
     * 获取待导出的危险化工工艺列表
     * @param companyName
     * @param risk
     * @return
     */
    List<CompanyInfo> getExportMajor(int pageIndex, int pageSize, String companyName, String risk);
}

