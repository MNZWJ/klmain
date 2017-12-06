package ax.kl.service;

import ax.kl.entity.SysMenu;
import ax.kl.entity.SysRoleMenu;
import java.util.List;

/**
 * @Author: Wangbiao
 * Description:
 * Date: 2017/11/30
 */
public interface SysRoleMenuService {
    /**
     * 获取角色权限树列表
     * @param roleId
     * @return
     */
    List<SysRoleMenu> getRoleMenuTreeList(String roleId);

    /**
     * 根据角色ID删除菜单ID
     * @param roleId
     * @param menuId
     * @return
     */
    boolean delRoleMenuByRoleId(String roleId, String[] menuId);

    /**
     * 插入角色菜单
     * @param roleId
     * @param menuId
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
