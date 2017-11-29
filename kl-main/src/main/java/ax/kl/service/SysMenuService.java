package ax.kl.service;

import ax.kl.entity.TreeModel;
import com.baomidou.mybatisplus.plugins.Page;
import ax.kl.entity.SysMenu;

import java.util.List;

/**
 * @Author: SuZhenpeng
 * Description:
 * Date: Created in 11:01 2017/11/13
 * @Modified By:
 */
public interface SysMenuService {
    /**
     * 获取菜单列表
     * @return
     */
    Page<SysMenu> GetMenuList(Page page, String parentId, String searchName);

    /**
     * 获取树列表
     * @return
     */
    List<TreeModel> getMenuTrueList();

    /**
     * 获取菜单列表
     * @return
     */
    List<SysMenu> GetMenusList();
    /**
     * 新增或更新菜单
     */
    String saveOrUpdateMenu( SysMenu menu);

    /**
     * 删除菜单
     */
    int deleteMenus(String[] ids);

    /**
     * 移动节点
     * @param type
     * @param menu
     * @return
     */
    String moveOrder(String type,SysMenu menu);

}
