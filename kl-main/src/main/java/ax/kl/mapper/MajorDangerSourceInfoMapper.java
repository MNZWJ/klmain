package ax.kl.mapper;

import ax.kl.entity.DangerSourceInfo;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface MajorDangerSourceInfoMapper {
    /**
     * 获取重大危险源详细信息
     * @param
     * @return 重大危险源实体
     */
    List<DangerSourceInfo> getMajorInfo(Page page, @Param("companyName") String companyName, @Param("sourceNmae") String sourceNmae,@Param("rank") String rank);

}
