package ax.kl.service;

import ax.kl.entity.CompanyInfo;
import ax.kl.entity.ProcessUnit;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
public interface ProcessUnitService {
    /**
     * 新增或更新工艺单元信息，添加就返回UUID码,参数是一个json字符串
     */
    String saveOrUpdateData(String cmd);

    /**
     * 验证工艺单元唯一编码是否存在
     * @param equipCode
     * @return
     */
    boolean validateUniqueCode(String equipCode);

    /**
     * 通过名称获取工艺单元信息
     * @param searchName
     * @return
     */
    Page<ProcessUnit> getProcessUnitList(Page page,@Param("searchName") String searchName);

    /**
     * 删除工艺单元信息
     */
    void delProcessUnit(String[] idLists);

}
