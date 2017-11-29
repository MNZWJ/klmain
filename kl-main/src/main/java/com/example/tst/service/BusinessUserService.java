package com.example.tst.service;

import com.baomidou.mybatisplus.plugins.Page;
import com.example.tst.entity.BusinessUser;
import com.example.tst.entity.SysOrganise;
import com.example.tst.entity.WorkTypeInfo;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface BusinessUserService {

    //获取岗位类型
    List<WorkTypeInfo> getWorkTypeInfo();

    //获取机构及其子机构的人员列表
    Page<SysOrganise> getBusinessUserList(Page page, String typeCode, String searchName);

    //添加或者修改对象
    String updateOrAddBusinessUser(HttpServletRequest request, BusinessUser businessUser);

    //删除人员
    void deleteBusinessUser(String[] idLists);
}
