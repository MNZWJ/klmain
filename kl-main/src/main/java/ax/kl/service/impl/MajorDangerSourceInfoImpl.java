package ax.kl.service.impl;

import ax.kl.entity.MajorHazard;
import ax.kl.mapper.MajorDangerSourceInfoMapper;
import ax.kl.service.MajorDangerSourceInfoService;
import com.baomidou.mybatisplus.plugins.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 *
 */
@Service
public class MajorDangerSourceInfoImpl implements MajorDangerSourceInfoService {

    @Autowired
    MajorDangerSourceInfoMapper MajorDangerSourceInfoMapper;

    /**
     * 获取重大危险源
     * CompanyName 所属企业Id
     * SourceName  重大危险源名称
     * Rank        危险源级别
     * @return
     */
    @Override
    public Page<MajorHazard> getMajorInfo(Page page, String companyName, String sourceNmae,String rank) {
        page.setRecords(MajorDangerSourceInfoMapper.getMajorInfo(page, companyName, sourceNmae,rank));
        return page;
    }

    /**
     * 获取待导出的危险源总数
     * @param companyName
     * @param sourceNmae
     * @param rank
     * @return
     */
    public int getExportMajorCount( String companyName, String sourceNmae, String rank){
        return  this.MajorDangerSourceInfoMapper.getExportMajorCount(companyName,sourceNmae,rank);
    }

    /**
     * 获取待导出的危险源列表
     * @param companyName
     * @param sourceNmae
     * @param rank
     * @return
     */
   public  List<MajorHazard> getExportMajor(int pageIndex,int pageSize,String companyName, String sourceNmae,String rank){
       return this.MajorDangerSourceInfoMapper.getExportMajor(pageIndex,pageSize,companyName,sourceNmae,rank);
   }
}
