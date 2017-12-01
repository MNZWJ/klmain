package ax.kl.mapper;

import ax.kl.entity.SysRoleUser;
import ax.kl.entity.TreeModel;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import javax.management.relation.Role;
import java.util.List;

/**
 * @author wangbiao
 *
 */
@Repository
public interface SysRoleUserMapper {
    /**
     * 获取人员树
     * @return
     */
    List<TreeModel> getUserTreeList();

    /**
     * 获取角色人员
     * @param RoleId(角色ID)
     * @return
     */
    List<SysRoleUser> getRoleUser(@Param("RoleId") String RoleId);

    /**
     * 根据角色ID删除角色人员
     * @param RoleId
     * @return
     */
    int delRoleUser(@Param("RoleId")String RoleId);

    /**
     * 插入角色人员
     * @param RoleId
     * @param UserId
     * @return
     */
    int addRoleUser(@Param("RoleId")String RoleId,@Param("UserId")String UserId);

    /**
     * 验证人员是否存在
     * @param UserId
     * @return
     */
    int validateUser(@Param("UserId")String UserId);
}
