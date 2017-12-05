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

@Transactional
@Service
public class SysRoleUserServiceImpl implements SysRoleUserService {
    @Autowired
    SysRoleUserMapper RoleUserMapper;
    /**
     * 获取人员树
     * @return
     */
    @Override
    public List<TreeModel> getUserTreeList(){
        return TreeUtil.getTree(RoleUserMapper.getUserTreeList());
    };

    /**
     * 角色人员
     * @param RoleId
     * @return
     */
    @Override
    public List<SysRoleUser> getRoleUser(String RoleId){
        return RoleUserMapper.getRoleUser(RoleId);
    }

    /**
     * 更新角色可管理人员
     * @param RoleId
     * @param UserId
     * @return
     */
    @Override
    public boolean updateRoleUser(String RoleId, String[] UserId) {
        RoleUserMapper.delRoleUser(RoleId);
        for (String u:UserId){
            RoleUserMapper.addRoleUser(RoleId,u);
        }
        return true;
    }

    /**
     * 根据用户ID获取用户角色
     * @param userId
     * @return
     */
     public String getRoleByUserId(String userId){
        String roleId = "";
        List<String> list = this.RoleUserMapper.getRoleByUserId(userId);
        for(String tempId : list){
            roleId = roleId+"," + tempId;
        }
        if(roleId.length()>0){
            roleId = roleId.substring(1);
        }
        return roleId;
    }
}
