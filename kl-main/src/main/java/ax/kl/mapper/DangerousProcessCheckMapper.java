package ax.kl.mapper;

import ax.kl.entity.CompanyInfo;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
@Repository
public interface DangerousProcessCheckMapper {

    /**
     * 获取危险化学品工艺
     * @param
     * @return
     */
    List<CompanyInfo> getProcessList(Page page, @Param("companyName") String companyName, @Param("risk") String risk);

}
