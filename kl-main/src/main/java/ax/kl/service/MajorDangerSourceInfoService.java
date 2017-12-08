package ax.kl.service;

import ax.kl.entity.DangerSourceInfo;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;

public interface MajorDangerSourceInfoService {
    /**
     * 获取重大危险源
     * @param
     * @return
     */
    Page<DangerSourceInfo> getMajorInfo(Page page, @Param("companyName") String companyName, @Param("sourceNmae") String sourceNmae, @Param("rank") String rank);
}
