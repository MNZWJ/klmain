package ax.kl.service.impl;


import ax.kl.entity.UserRole;
import ax.kl.mapper.SysDictionaryMapper;
import ax.kl.mapper.UserRoleMapper;
import ax.kl.service.UserRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class UserRoleServiceImpl implements UserRoleService {


    @Autowired
    private UserRoleMapper userRoleMapper;

    @Autowired
    private SysDictionaryMapper sysDictionaryMapper;

    /**
     * 角色人员
     * @param UserId
     * @return
     */
    @Override
    public List<UserRole> getRoleInfo(String UserId){
        return userRoleMapper.getRoleInfo(UserId);
    }

    /**
     * 根据角色ID删除菜单ID
     * @param roleId
     * @return
     */
    @Override
    public boolean delRoleMenuByRoleId(String menuId, String[] roleId){
        userRoleMapper.delRoleByRoleId(menuId);//左侧人员ID
        for (String m:roleId)
            userRoleMapper.insertRole(menuId,m);
        return true;
    }

    /**
     * 插入角色菜单
     * @param roleId
     * @return
     */
    @Override
    public int insertRoleMenu(String roleId,String menuId){
        return  userRoleMapper.insertRole(roleId,menuId);
    };
}
