package ax.kl.service;

import ax.kl.entity.CompanyInfo;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;

/**
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
}
