package ax.kl.mapper;

import ax.kl.entity.AlarmType;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 报警代码信息录入
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
@Repository
public interface AlarmTypeMapper {

    /**
     * 新增报警代码信息
     */
    int  insertAlarmType(AlarmType alarmType);

    /**
     * 验证报警类型唯一编码是否存在
     * @param typeCode
     * @return
     */
    int validateTypeCode(@Param("TypeCode") String typeCode);

    /**
     * 更新报警代码信息
     */
    int updateAlarmType(AlarmType alarmType);


    /**
     * 通过名称获取报警代码信息
     * @param typeName
     * @return
     */
    List<AlarmType> getAlarmTypeList(Page page, @Param("typeName") String typeName);


    /**
     * 删除数据
     * @param idLists
     * @return
     */
    void delAlarmType(String[] idLists);
}
