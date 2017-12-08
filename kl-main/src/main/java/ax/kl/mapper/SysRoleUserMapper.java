package ax.kl.mapper;

import ax.kl.entity.SysRole;
import ax.kl.entity.SysRoleUser;
import ax.kl.entity.TreeModel;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import javax.management.relation.Role;
import java.util.List;

/**
 * 角色人员
 * @author wangbiao
 * Date 2017/11/30
 */
@Repository
public interface SysRoleUserMapper {
    /**
     * 获取人员树
     * @return 人员树
     */
    List<TreeModel> getUserTreeList();

    /**
     * 获取角色人员
     * @param roleId(角色ID)
     * @return 人员类
     */
    List<SysRoleUser> getRoleUser(@Param("roleId") String roleId);

    /**
     * 根据角色ID删除角色人员
     * @param roleId 角色Id
     * @return
     */
    int delRoleUser(@Param("roleId")String roleId);

    /**
     * 插入角色人员
     * @param roleId 角色Id
     * @param userId 人员Id
     * @return
     */
    int addRoleUser(@Param("roleId")String roleId,@Param("userId")String userId);

    /**
     * 验证人员是否存在
     * @param userId 人员Id
     * @return
     */
    int validateUser(@Param("userId")String userId);

    /**
     * 根据用户ID获取所有的角色
     * @param userId 用户Id
     * @return
     */
    List<String> getRoleByUserId(@Param("userId") String userId);
}
