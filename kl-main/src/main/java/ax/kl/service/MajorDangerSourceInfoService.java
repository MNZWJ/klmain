package ax.kl.service;

import ax.kl.entity.MajorHazard;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;

public interface MajorDangerSourceInfoService {
    /**
     * 获取重大危险源
     * @param
     * @return
     */
    Page<MajorHazard> getMajorInfo(Page page, @Param("companyName") String companyName, @Param("sourceNmae") String sourceNmae, @Param("rank") String rank);
}
