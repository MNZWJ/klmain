package ax.kl.service.impl;

import ax.kl.entity.CompanyInfo;
import ax.kl.mapper.DangerousProcessCheckMapper;
import ax.kl.service.DangerousProcessCheckService;
import com.baomidou.mybatisplus.plugins.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
@Service
public class DangerousProcessCheckImpl implements DangerousProcessCheckService {
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
}
