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
}
