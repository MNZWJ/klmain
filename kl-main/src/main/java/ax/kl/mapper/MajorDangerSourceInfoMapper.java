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
    List<DangerSourceInfo> getMajorInfo(Page page, @Param("companyName") String companyName, @Param("sourceName") String sourceName,@Param("rank") String rank);

    /**
     * 获取待导出的危险源总数
     * @param companyName
     * @param sourceName
     * @param rank
     * @return
     */
    int getExportMajorCount(@Param("companyName") String companyName, @Param("sourceName") String sourceName,@Param("rank") String rank);

    /**
     * 获取待导出的危险源列表
     * @param companyName
     * @param sourceName
     * @param rank
     * @return
     */
    List<DangerSourceInfo> getExportMajor(@Param("pageIndex") int pageIndex,@Param("pageSize") int pageSize,
                                     @Param("companyName") String companyName, @Param("sourceName") String sourceName,@Param("rank") String rank);

}
