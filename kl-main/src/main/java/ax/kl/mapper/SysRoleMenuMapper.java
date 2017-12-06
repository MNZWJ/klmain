package ax.kl.mapper;

import ax.kl.entity.SysMenu;
import ax.kl.entity.SysRoleMenu;
import com.baomidou.mybatisplus.mapper.BaseMapper;
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
public interface SysRoleMenuMapper extends BaseMapper<SysRoleMenu> {

    /**
     * 获取角色权限树列表
     * @param roleId 角色Id
     * @return
     */
    List<SysRoleMenu> getRoleMenuTreeList(@Param("roleId") String roleId);

    /**
     * 根据角色ID删除菜单ID
     * @param roleId 角色Id
     * @return
     */
    int delRoleMenuByRoleId(@Param("roleId") String roleId);

    /**
     * 插入角色菜单
     * @param roleId 角色Id
     * @return
     */
    int insertRoleMenu(@Param("roleId") String roleId, @Param("menuId") String menuId);

    /**
     * 根据角色获取权限菜单
     * @param roleIds 角色Id数组
     * @return
     */
    List<SysMenu> getMenusByRoleId(String[] roleIds);
}
