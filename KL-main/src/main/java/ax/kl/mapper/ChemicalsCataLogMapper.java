package ax.kl.mapper;

import ax.kl.entity.ChemicalCataLog;
import ax.kl.entity.ChemicalsInfo;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 化学品信息展示
 * @author Created by mxl
 * @version 创建时间：${date} ${time}
 */
@Repository
public interface ChemicalsCataLogMapper {


    /**
     * 获取化学品列表
     * @param page        分页
     * @param chemName    化学品名称
     * @param   cas
     * @return
     */
    List<ChemicalCataLog> getChemicalCataLogInfoList(Page page, @Param("chemName") String chemName, @Param("cas") String cas);


    /**
     * 获取待导出的化学品信息总数
     * @param chemName
     * @param cas
     * @return
     */
    int getExportMajorCount(@Param("chemName") String chemName,  @Param("cas") String cas);

    /**
     * 获取待导出的化学品信息表
     * @param pageIndex
     * @param pageSize
     * @param chemName
     * @param cas
     * @return
     */
    List<ChemicalCataLog> getExportMajor(@Param("pageIndex") int pageIndex, @Param("pageSize") int pageSize,
                                       @Param("chemName") String chemName, @Param("cas") String cas);


}
