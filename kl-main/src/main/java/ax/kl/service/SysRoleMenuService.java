package ax.kl.service;

import ax.kl.entity.SysMenu;
import ax.kl.entity.SysRoleMenu;
import java.util.List;

/**
 * @Author: SuZhenpeng
 * Description:
 * Date: Created in 11:01 2017/11/13
 * @Modified By:
 */
public interface SysRoleMenuService {
    /**
     * 获取角色权限树列表
     * @return
     */
    List<SysRoleMenu> getRoleMenuTreeList(String roleId);

    /**
     * 根据角色ID删除菜单ID
     * @param roleId
     * @return
     */
    boolean delRoleMenuByRoleId(String roleId, String[] menuId);

    /**
     * 插入角色菜单
     * @param roleId
     * @return
     */
    int insertRoleMenu(String roleId, String menuId);

    /**
     * 根据角色ID获取权限菜单
     * @param roleIds
     * @return
     */
    List<SysMenu> getMenusByRoleId(String[] roleIds);
}
