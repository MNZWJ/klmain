package ax.kl.service.impl;

import ax.kl.entity.LoginInfo;
import ax.kl.entity.SysRole;
import ax.kl.entity.SysUser;
import ax.kl.mapper.SysRoleMapper;
import ax.kl.mapper.SysUserMapper;
import ax.kl.service.SysRoleService;
import ax.kl.service.SysUserService;
import com.baomidou.mybatisplus.plugins.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @Author: XUM
 * Description:
 * Date: Created in 9:55 2017/12/5
 * @Modified By:
 */
@Service
public class SysUserServiceImpl implements SysUserService {

    @Autowired
    SysUserMapper SysUserMapper;

    /**
     * 根据登录名获取登录信息
     * @param loginName
     * @return
     */
    public SysUser getUserInfoByLoginName(String loginName){
        SysUser sysUser = null;
        List<SysUser> list = this.SysUserMapper.getUserInfoByLoginName(loginName);
        if(list!=null && list.size()>0){
            sysUser = list.get(0);
        }
        return sysUser;
    }
}
