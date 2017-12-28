package ax.kl.mapper;

import ax.kl.entity.LoginInfo;
import ax.kl.entity.SysUser;
import ax.kl.entity.TreeModel;
import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.baomidou.mybatisplus.plugins.Page;
import ax.kl.entity.SysBusinessUser;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SysBusinessUserMapper extends BaseMapper<SysBusinessUser> {

    /**
     * 根据点击的节点及其子节点的ID值来对人员进行条件查询
     */
    List<SysBusinessUser> getBusinessUserList(Page page, @Param("typeCode") String typeCode, @Param("searchName") String searchName);

    /**
     * 添加数据
     */
    void insertBusinessUser(SysBusinessUser businessUser);

    /**
     * 更新数据
     */
    void updateBusinessUser(SysBusinessUser businessUser);

    /**
     * 删除数据
     */
    void deleteBusinessUser(String[] idLists);

    /**
     * 保存登陆人员信息
     * @param businessUser
     */
    void saveUser(SysBusinessUser businessUser);

    /**
     * 检查登录名
     * @param loginName
     * @return
     */
    List<SysUser> checkLoginName(@Param("loginName") String loginName);

    /**
     * 根据用户ID获取用户信息
     * @param buserId
     * add--xum  用于用户登录
     * @return
     */
    List<LoginInfo> getUserInfo(@Param("buserId") String buserId);

    /**
     * 获取组织机构树
     * @return
     */
    List<TreeModel> getSysOrganiseTreeList();
}
