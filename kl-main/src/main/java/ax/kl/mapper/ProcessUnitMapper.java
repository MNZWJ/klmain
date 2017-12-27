package ax.kl.mapper;

import ax.kl.entity.CompanyInfo;
import ax.kl.entity.DangerSourceInfo;
import ax.kl.entity.HiddenAccident;
import ax.kl.entity.ProcessUnit;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

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
     * 验证工艺单元唯一编码是否存在
     * @param uniqueCodeU
     * @return
     */
    int validateUniqueCode(@Param("uniqueCodeU")String uniqueCodeU);

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

    /**
     * 获取重大危险源信息
     * @return
     */
    List<Map<String,String>> getDangerSource();

    /**
     * 获取所有企业信息
     * @return
     */
    List<Map<String,String>> getCompany();

    /**
     *查看公司和危险源是否能配起来
     * @param sourceName
     * @param companyId
     * @return
     */
    DangerSourceInfo check(@Param("sourceName")String sourceName, @Param("companyId")String companyId);

    /**
     * 插入工艺单元集合
     * @param list
     * @return
     */
    int insertProcessUnit(@Param("list")List<ProcessUnit> list);

    /**
     *获取所有工艺单元
     * @return
     */
    List<Map<String,String>> getProcessUnit();



}
