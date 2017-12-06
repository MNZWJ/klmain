package ax.kl.service;

import ax.kl.entity.UserRole;

import java.util.List;

/**
 * @author Administrator
 */
public interface UserRoleService {

     /* 删除角色菜单
     * @param roleId
     * @param menuId
     * @return
     */
    boolean delRoleMenuByRoleId(String menuId, String[] roleId);//menuid左侧人员树ID，roleID右侧角色ID

    /**
     * 插入角色菜单
     * @param roleId
     * @return
     */
    int insertRoleMenu(String roleId, String menuId);

    /**
     * 根据人员id获取选中角色
     * @param UserId
     * @return
     */
    List<UserRole> getRoleInfo(String UserId);

}
