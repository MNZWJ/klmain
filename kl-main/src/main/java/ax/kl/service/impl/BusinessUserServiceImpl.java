package ax.kl.service.impl;

import ax.kl.entity.SysOrganise;
import ax.kl.service.BusinessUserService;
import com.baomidou.mybatisplus.plugins.Page;
import ax.kl.entity.BusinessUser;
import ax.kl.entity.WorkTypeInfo;
import ax.kl.mapper.BusinessUserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Service

public class BusinessUserServiceImpl implements BusinessUserService {

    @Autowired
    private BusinessUserMapper businessUserMapper;


    //获取岗位类型
    @Override
    public List<WorkTypeInfo> getWorkTypeInfo() {
        return businessUserMapper.getWorkTypeInfo();
    }

    //显示人员列表
    @Override
    public Page<SysOrganise> getBusinessUserList(Page page, String typeCode, String searchName) {

//        List<String> ids=new ArrayList<>();
//        //查找此typeCode下的子机构（包含自己）
//        ids=businessUserMapper.getChildByTypeCode(ids);
//        //将获取的节点ID集合转成数组
//        String[] arrId= (String[]) ids.toArray();
        //获取对应的人员列表
        page.setRecords(businessUserMapper.getBusinessUserList(page,typeCode,searchName));
        return page;
    }

    @Override
    @Transactional
    public String updateOrAddBusinessUser(HttpServletRequest request,BusinessUser businessUser) {
        //如果传来的对象没有userId，说明是添加数据
        if(businessUser.getUserId().equals("")||businessUser.getUserId()==null){
            //UUID码来创建ID
            String userId= UUID.randomUUID().toString();
            businessUser.setUserId(userId);
            BusinessUser user= (BusinessUser) request.getSession().getAttribute("user");
            businessUser.setCreateDeptId(user==null?"0000":user.getDeptId());
            businessUser.setCreateUserId(user==null?"0000":user.getUserId());
            //添加数据
            businessUserMapper.insertBusinessUser(businessUser);
            return userId;
        }else{
            //有UserId，说明是更新数据
            businessUserMapper.updateBusinessUser(businessUser);
            return "";
        }
    }

    @Override
    @Transactional
    public void deleteBusinessUser(String[] idLists) {
        //直接删除
        businessUserMapper.deleteBusinessUser(idLists);
    }


}
