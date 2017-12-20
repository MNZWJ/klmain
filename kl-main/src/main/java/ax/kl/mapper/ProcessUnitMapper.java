package ax.kl.mapper;

import ax.kl.entity.CompanyInfo;
import ax.kl.entity.ProcessUnit;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 工艺单元信息录入
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
@Repository
public interface ProcessUnitMapper {

    /**
     * 新增工艺单元信息
     */
    int  insertUnit(ProcessUnit processUnit);

    /**
     * 更新工艺单元信息
     */
    int updateUnit(ProcessUnit processUnit);


    /**
     * 通过名称获取工艺单元信息
     * @param unitName
     * @return
     */
    List<ProcessUnit> getProcessUnitList(Page page, @Param("unitName") String unitName);


    /**
     * 删除数据
     * @param idLists
     * @return
     */
    void delProcessUnit(String[] idLists);
}
