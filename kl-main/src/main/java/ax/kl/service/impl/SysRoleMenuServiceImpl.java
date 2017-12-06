package ax.kl.service.impl;

import ax.kl.entity.SysMenu;
import ax.kl.entity.SysRoleMenu;
import ax.kl.mapper.SysRoleMenuMapper;
import ax.kl.service.SysRoleMenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 角色菜单
 * @author wangbiao
 * Date 2017/12/04
 */
@Transactional
@Service
public class SysRoleMenuServiceImpl implements SysRoleMenuService {
    @Autowired
    SysRoleMenuMapper roleMenuMapper;
    /**
     * 角色权限树列表
     * @return
     */
    @Override
    public List<SysRoleMenu> getRoleMenuTreeList(String roleId){
        return roleMenuMapper.getRoleMenuTreeList(roleId);
    }

    /**
     * 根据角色ID删除菜单ID
     * @param roleId
     * @return
     */
    @Override
    public boolean delRoleMenuByRoleId(String roleId,String[] menuId){
        roleMenuMapper.delRoleMenuByRoleId(roleId);
        for (String m:menuId){
            roleMenuMapper.insertRoleMenu(roleId,m);
        }
        return true;
    }

    /**
     * 插入角色菜单
     * @param roleId
     * @return
     */
    @Override
    public int insertRoleMenu(String roleId,String menuId){
        return  roleMenuMapper.insertRoleMenu(roleId,menuId);
    };

    /**
     * 根据角色ID获取权限菜单
     * @param roleIds
     * @return
     */
    @Override
    public List<SysMenu> getMenusByRoleId(String[] roleIds){
        return this.roleMenuMapper.getMenusByRoleId(roleIds);
    }


}
