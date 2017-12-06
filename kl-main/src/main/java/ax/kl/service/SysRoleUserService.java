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
     * @param roleId
     * @return
     */
    List<SysRoleUser> getRoleUser(String roleId);

    /**
     * 更新角色人员
     * @param roleId
     * @param userId
     * @return
     */
    boolean updateRoleUser(String roleId,String[] userId);

    /**
     * 根据用户ID获取用户角色
     * @param userId
     * @return
     */
    String getRoleByUserId(String userId);
}
