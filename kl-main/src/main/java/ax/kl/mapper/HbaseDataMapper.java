package ax.kl.mapper;

import ax.kl.entity.ChemicalsInfo;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Hbase数据查询
 * @author xum
 * Date 2017/12/21
 */
@Repository
public interface HbaseDataMapper {

    /**
     * 获取设备字典表
     * @return
     */
    @MapKey("UniqueCode")
    public Map<String,Map<String,String>> getCompanyDict();

    /**
     * 获取重大危险源字典表
     * @return
     */
    @MapKey("UniqueCode")
    public Map<String,Map<String,String>> getDresourceDict(@Param("companyCode") String companyCode);

    /**
     * 获取工艺单元字典表
     * @return
     */
    @MapKey("UniqueCode")
    public Map<String,Map<String,String>> getUnitDict(@Param("dresourceCode") String dresourceCode);

    /**
     * 获取设备字典表
     * @return
     */
    @MapKey("UniqueCode")
    public Map<String,Map<String,String>> getEquipDict(@Param("unitCode") String unitCode);

    /**
     * 获取指标字典表
     * @return
     */
    @MapKey("TargetCode")
    public Map<String,Map<String,String>> getTargetDict();

    /**
     * 获取报警类型字典表
     * @return
     */
    @MapKey("TypeCode")
    public Map<String,Map<String,String>> getAlarmDict();
}
