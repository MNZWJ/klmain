package ax.kl.mapper;

import com.baomidou.mybatisplus.plugins.Page;
import ax.kl.entity.SysOrganise;
import ax.kl.entity.TreeModel;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SysOrganiseMapper {

    /**
     * 获取组织机构列表，可条件查询
     */
    List<SysOrganise> getSysOrganiseList(Page page, @Param("typeId") String typeId, @Param("searchName") String searchName);


    /**
     * 获取组织机构树
     * @return
     */
    List<TreeModel> getSysOrganiseTreeList();

    /**
     * 新增组织机构
     */
    int  insertSysOrganise(SysOrganise sysOrganise);

    /**
     * 获取组织机构序号
     */
    int  getMaxOrder();


    /**
     * 更新组织机构
     */
    int updateSysOrganise(SysOrganise sysOrganise);

    /**
     * 单一或批量删除组织机构
     */
    int deleteSysOrganises(String[] ids);


//    /**
//     * 获取是否有排序序号
//     * @param parentId
//     * @param type
//     * @return
//     */
//    List<SysOrganise> getOrder(@Param("parentId") String parentId, @Param("type") String type, @Param("showOrder") String showOrder);
//
//    /**
//     * 进行排序
//     * @param organiseId1
//     * @param showOrder1
//     * @param organiseId2
//     * @param showOrder2
//     * @return
//     */
//    int upDateOrderSort(@Param("organiseId1")String organiseId1,@Param("showOrder1")String showOrder1,@Param("organiseId2")String organiseId2,@Param("showOrder2")String showOrder2);


    /**
     * 判断机构下是否有子机构
     * @param ids
     * @return
     */
    List<SysOrganise> getSysOrganiseType(String[] ids);

    //获取所有组织机构
    List<SysOrganise> getAllSysOrganises();
}
