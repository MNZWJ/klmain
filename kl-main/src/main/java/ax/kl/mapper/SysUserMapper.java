package ax.kl.mapper;

import ax.kl.entity.LoginInfo;
import ax.kl.entity.SysMenu;
import ax.kl.entity.SysUser;
import ax.kl.entity.TreeModel;
import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.baomidou.mybatisplus.plugins.Page;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author: XUM
 * Description:
 * Date: Created in 10:23 2017/12/5
 * @Modified By:
 */
@Repository
public interface SysUserMapper extends BaseMapper<SysUser> {

    /**
     * 根据登录名获取用户登录信息
     * @param loginName
     * @return
     */
    List<SysUser> getUserInfoByLoginName(@Param("loginName") String loginName);

    /**
     * 根据用户ID和密码校验用户是否存在
     * @param userId
     * @param oldPwd
     * @return
     */
    int checkUserByIdPwd(@Param("userId") String userId,@Param("oldPwd") String oldPwd);

    /**
     * 更新密码
     * @param userId
     * @param oldPwd
     * @param newPwd
     */
    void updatePwd(@Param("userId") String userId,@Param("oldPwd") String oldPwd,
                   @Param("newPwd") String newPwd);
}
