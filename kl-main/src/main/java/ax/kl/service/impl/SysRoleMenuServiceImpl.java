package ax.kl.service.impl;

import ax.kl.entity.SysRoleMenu;
import ax.kl.mapper.SysRoleMenuMapper;
import ax.kl.service.SysRoleMenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class SysRoleMenuServiceImpl implements SysRoleMenuService {
    @Autowired
    SysRoleMenuMapper RoleMenuMapper;
    /**
     * 角色权限树列表
     * @return
     */
    @Override
    public List<SysRoleMenu> getRoleMenuTreeList(String roleId){
        return RoleMenuMapper.getRoleMenuTreeList(roleId);
    }

    /**
     * 根据角色ID删除菜单ID
     * @param roleId
     * @return
     */
    public boolean delRoleMenuByRoleId(String roleId,String[] menuId){
        RoleMenuMapper.delRoleMenuByRoleId(roleId);
        for (String m:menuId)
            RoleMenuMapper.insertRoleMenu(roleId,m);
        return true;
    }

    /**
     * 插入角色菜单
     * @param roleId
     * @return
     */
    public int insertRoleMenu(String roleId,String menuId){
        return  RoleMenuMapper.insertRoleMenu(roleId,menuId);
    };
}
