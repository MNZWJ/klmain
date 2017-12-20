package ax.kl.service;

import ax.kl.entity.DangerSourceInfo;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface MajorDangerSourceInfoService {
    /**
     * 获取重大危险源
     * @param
     * @return
     */
    Page<DangerSourceInfo> getMajorInfo(Page page,  Map<String, String> param);

    /**
     * 获取待导出的危险源总数
     * @param companyName
     * @param soureName
     * @param rank
     * @return
     */
    int getExportMajorCount(String companyName, String soureName, String rank);

    /**
     * 获取待导出的危险源列表
     * @param companyName
     * @param soureName
     * @param rank
     * @return
     */
    List<DangerSourceInfo> getExportMajor(int pageIndex,int pageSize,String companyName, String soureName,String rank);
}
