package ax.kl.mapper;

import com.baomidou.mybatisplus.plugins.Page;
import ax.kl.entity.SysBusinessUser;
import ax.kl.entity.WorkTypeInfo;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SysBusinessUserMapper {

    //获取岗位类型
    List<WorkTypeInfo> getWorkTypeInfo();


    //根据点击的节点及其子节点的ID值来对人员进行条件查询
    List<SysBusinessUser> getBusinessUserList(Page page, @Param("typeCode") String typeCode, @Param("searchName") String searchName);

    //添加数据
    void insertBusinessUser(SysBusinessUser businessUser);

    //更新数据
    void updateBusinessUser(SysBusinessUser businessUser);

    //删除数据
    void deleteBusinessUser(String[] idLists);
}
