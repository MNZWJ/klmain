package ax.kl.service.impl;

import ax.kl.common.TreeUtil;
import ax.kl.entity.SysRoleUser;
import ax.kl.entity.TreeModel;
import ax.kl.mapper.SysRoleUserMapper;
import ax.kl.service.SysRoleUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * 角色人员
 * @author wangbiao
 * Date 2017/11/30
 */
@Transactional
@Service
public class SysRoleUserServiceImpl implements SysRoleUserService {
    @Autowired
    SysRoleUserMapper roleUserMapper;
    /**
     * 获取人员树
     * @return
     */
    @Override
    public List<TreeModel> getUserTreeList(){
        return TreeUtil.getTree(roleUserMapper.getUserTreeList());
    };

    /**
     * 角色人员
     * @param RoleId
     * @return
     */
    @Override
    public List<SysRoleUser> getRoleUser(String RoleId){
        return roleUserMapper.getRoleUser(RoleId);
    }

    /**
     * 更新角色可管理人员
     * @param RoleId
     * @param UserId
     * @return
     */
    @Override
    public boolean updateRoleUser(String RoleId, String[] UserId) {
        roleUserMapper.delRoleUser(RoleId);
        for (String u:UserId){
            roleUserMapper.addRoleUser(RoleId,u);
        }
        return true;
    }

    /**
     * 根据用户ID获取用户角色
     * @param userId
     * @return
     */
    @Override
     public String getRoleByUserId(String userId){
        String roleId = "";
        List<String> list = this.roleUserMapper.getRoleByUserId(userId);
        for(String tempId : list){
            roleId = roleId+"," + tempId;
        }
        if(roleId.length()>0){
            roleId = roleId.substring(1);
        }
        return roleId;
    }
}
