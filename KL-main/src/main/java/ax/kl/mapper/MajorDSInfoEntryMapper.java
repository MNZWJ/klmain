package ax.kl.mapper;

import ax.kl.entity.DangerSourceInfo;
import ax.kl.entity.FacilitiesCondition;
import ax.kl.entity.LegalProtection;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 重大危险源信息录入
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
@Repository
public interface MajorDSInfoEntryMapper {

    /**
     * 通过ID获取危险源信息
     * @param sourceId
     * @return
     */
    List<DangerSourceInfo> getSourceInfo(@Param("sourceId") String sourceId);

    /**
     * 通过id获取装置设施周围环境
     * @param sourceId
     * @return
     */
    List<FacilitiesCondition> getSourceEquipList(@Param("sourceId") String sourceId);

    /**
     * 通过id获取法律保护区信息
     * @param sourceId
     * @return
     */
    List<LegalProtection> getSourceLegalList(@Param("sourceId") String sourceId);

    /**
     * 删除数据
     */
    void delSourceInfo(String[] idLists);

    /**
     * 新增信息
     */
    int  saveData( DangerSourceInfo form);

    /**
     * 更新信息
     */
    int updateData( DangerSourceInfo form);

    /**
     * 保存事故类型信息
     * @param IndustryCode
     * @param sourceId
     */
    void  saveSGLXData(@Param("industry") String[] IndustryCode, @Param("sourceId")String sourceId);


    /**
     * 保存装置设施周围环境
     * @param processTable
     * @param sourceId
     * @return
     */
    void saveEquipData(@Param("processTable")List<FacilitiesCondition> processTable, @Param("sourceId")String sourceId);


    /**
     * 保存法律保护区信息
     * @param certTable
     * @param sourceId
     * @return
     */
    void saveLegalData(@Param("certTable") List<LegalProtection> certTable,@Param("sourceId")String sourceId);


}
