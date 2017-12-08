package ax.kl.mapper;


import ax.kl.entity.SysUserRole;
import com.baomidou.mybatisplus.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Administrator
 */
@Repository
public interface SysUserRoleMapper extends BaseMapper<SysUserRole> {


    /**
     * 插入角色菜单
     * @param menuId
     * @return
     */
    int insertRole(@Param("menuId") String menuId, @Param("roleId") String roleId);//menuID
    /**
     * 根据人员ID删除菜单ID
     * @param menuId
     * @return
     */
    int delRoleByRoleId(@Param("UserId") String menuId);

    /**
     * 获取角色人员
     * @param UserId(人员ID)
     * @return
     */
    List<SysUserRole> getRoleInfo(@Param("UserId") String UserId);


}
