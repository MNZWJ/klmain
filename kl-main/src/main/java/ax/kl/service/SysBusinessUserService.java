package ax.kl.service;

import ax.kl.entity.LoginInfo;
import ax.kl.entity.SysOrganise;
import com.baomidou.mybatisplus.plugins.Page;
import ax.kl.entity.SysBusinessUser;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface SysBusinessUserService {

    /**
     * 获取机构及其子机构的人员列表
     */
    Page<SysOrganise> getBusinessUserList(Page page, String typeCode, String searchName);

    /**
     * 添加或者修改对象
     */
    String updateOrAddBusinessUser(HttpServletRequest request, SysBusinessUser businessUser);

    /**
     * 删除人员
     */
    void deleteBusinessUser(String[] idLists);

    /**
     * 检查登录名
     * @param loginName
     * @return
     */
    boolean checkLoginName( String loginName);

    /**
     * 根据ID获取用户信息
     * @param buserId
     * @return
     */
    LoginInfo getUserInfo(String buserId);

}
