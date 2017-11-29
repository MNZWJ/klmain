package ax.kl.mapper;

import ax.kl.entity.Menu;
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
public interface MenuMapper extends BaseMapper<Menu> {

    /**
     * 获取菜单
     */
    List<Menu> GetMenuList(Page page,@Param("parentId") String parentId,@Param("searchName") String searchName);


    /**
     * 获取树列表
     * @return
     */
    List<TreeModel> getMenuTreeList();

    /**
     * 获取菜单列表
     * @return
     */
    List<Menu> GetMenusList();
    /**
     * 新增菜单
     */
    int  saveMenu( Menu menu);

    /**
     * 获取菜单序号
     */
    int  getMaxOrder();

    /**
     * 更新菜单
     */
    int updateMenu(Menu menu);

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
    List<Menu> getOrder(@Param("parentId") String parentId, @Param("type") String type, @Param("menuOrder") String menuOrder);

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
    List<Menu> getMenuType(String[] ids);



}
