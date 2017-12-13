package ax.kl.service;

import ax.kl.entity.MajorHazard;
import com.baomidou.mybatisplus.plugins.Page;

import java.util.List;

public interface MajorDangerSourceInfoService {
    /**
     * 获取重大危险源
     * @param
     * @return
     */
    Page<MajorHazard> getMajorInfo(Page page, String companyName, String soureName,String rank);

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
    List<MajorHazard> getExportMajor(int pageIndex,int pageSize,String companyName, String soureName,String rank);

}
