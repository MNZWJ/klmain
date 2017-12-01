package ax.kl.service;

import ax.kl.entity.SysRoleUser;
import ax.kl.entity.TreeModel;
import java.util.List;

/**
 * @author wangbiao
 * 角色人员
 */
public interface SysRoleUserService {

    /**
     * 获取人员树
     * @return
     */
    List<TreeModel> getUserTreeList();

    /**
     * get角色人员
     * @param RoleId
     * @return
     */
    List<SysRoleUser> getRoleUser(String RoleId);

    /**
     * 更新角色人员
     * @param RoleId
     * @param UserId
     * @return
     */
    boolean updateRoleUser(String RoleId,String[] UserId);
}
