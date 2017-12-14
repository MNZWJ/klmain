package ax.kl.service.impl;

import ax.kl.entity.CompanyInfo;
import ax.kl.mapper.DangerousProcessCheckMapper;
import ax.kl.service.DangerousProcessCheckService;
import com.baomidou.mybatisplus.plugins.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 危险化学品工艺
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
@Service
public class DangerousProcessCheckServiceImpl implements DangerousProcessCheckService {
    @Autowired
    DangerousProcessCheckMapper DangerousProcessCheckMapper;
    /**
     * 获取危险化学品工艺
     * CompanyName 所属企业Id
     * Rank        危险化学品工艺
     * @return
     */
    @Override
    public Page<CompanyInfo> getProcessList(Page page, String companyName, String risk) {
        page.setRecords(DangerousProcessCheckMapper.getProcessList(page, companyName,risk));
        return page;
    }

    /**
     * 获取待导出的危险化学品工艺总数
     * @param companyName
     * @param risk
     * @return
     */
    @Override
    public int getExportMajorCount( String companyName, String risk){
        return  this.DangerousProcessCheckMapper.getExportMajorCount(companyName,risk);
    }

    /**
     * 获取待导出的危险化学品工艺列表
     * @param companyName
     * @param risk
     * @return
     */
    @Override
    public List<CompanyInfo> getExportMajor(int pageIndex, int pageSize, String companyName, String risk){
        return this.DangerousProcessCheckMapper.getExportMajor(pageIndex,pageSize,companyName,risk);
    }
}
