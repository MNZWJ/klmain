package ax.kl.mapper;

import ax.kl.entity.SysMenu;
import ax.kl.entity.TreeModel;
import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author: SuZhenpeng
 * Description:
 * Date: Created in 10:23 2017/11/13
 * @Modified By:
 */
@Repository
public interface SysMenuMapper extends BaseMapper<SysMenu> {

    /**
     * 获取菜单
     */
    List<SysMenu> GetMenuList(Page page, @Param("parentId") String parentId, @Param("searchName") String searchName);


    /**
     * 获取树列表
     * @return
     */
    List<TreeModel> getMenuTreeList();

    /**
     * 获取菜单列表
     * @return
     */
    List<SysMenu> GetMenusList();
    /**
     * 新增菜单
     */
    int  saveMenu( SysMenu menu);

    /**
     * 获取菜单序号
     */
    int  getMaxOrder();

    /**
     * 更新菜单
     */
    int updateMenu(SysMenu menu);

    /**
     * 删除菜单
     */
    int deleteMenus(String[] ids);


    /**
     * 获取是否有排序序号
     * @param parentId
     * @param type
     * @return
     */
    List<SysMenu> getOrder(@Param("parentId") String parentId, @Param("type") String type, @Param("menuOrder") String menuOrder);

    /**
     * 进行排序
     * @param menuId1
     * @param menuOrder1
     * @param menuId2
     * @param menuOrder2
     * @return
     */
    int upDateOrderSort(@Param("menuId1")String menuId1,@Param("menuOrder1")String menuOrder1,@Param("menuId2")String menuId2,@Param("menuOrder2")String menuOrder2);


    /**
     * 判断字典下是否有子字典
     * @param ids
     * @return
     */
    List<SysMenu> getMenuType(String[] ids);



}
