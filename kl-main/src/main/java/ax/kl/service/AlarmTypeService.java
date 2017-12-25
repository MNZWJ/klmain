package ax.kl.service;

import ax.kl.entity.AlarmType;
import ax.kl.entity.ProcessUnit;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;

/**
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
public interface AlarmTypeService {
    /**
     * 新增或更新报警代码信息，添加就返回UUID码,参数是一个json字符串
     */
    String saveOrUpdateData(String cmd);

    /**
     * 验证报警代码唯一编码是否存在
     * @param typeCode
     * @return
     */
    boolean validateTypeCode(String typeCode);

    /**
     * 通过名称获取报警代码信息
     * @param searchName
     * @return
     */
    Page<AlarmType> getAlarmTypeList(Page page, @Param("searchName") String searchName);

    /**
     * 删除工艺单元信息
     */
    void delAlarmType(String[] idLists);

}
