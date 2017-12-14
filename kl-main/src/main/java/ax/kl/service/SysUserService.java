package ax.kl.service;

import ax.kl.entity.LoginInfo;
import ax.kl.entity.SysRole;
import ax.kl.entity.SysUser;
import com.baomidou.mybatisplus.plugins.Page;

/**
 * @Author: XUM
 * Description:
 * Date: Created in 9:53 2017/12/5
 * @Modified By:
 */

public interface SysUserService {

    /**
     * 根据登录名获取登录信息
     * @param loginName
     * @return
     */
    SysUser getUserInfoByLoginName(String loginName);

    /**
     * 根据用户ID和密码校验用户是否存在
     * @param userId
     * @param pwd
     * @return
     */
    int checkUserByIdPwd(String userId,String pwd);

    /**
     * 更新密码
     * @param userId
     * @param oldPwd
     * @param newPwd
     */
    void updatePwd(String userId,String oldPwd, String newPwd);
}
