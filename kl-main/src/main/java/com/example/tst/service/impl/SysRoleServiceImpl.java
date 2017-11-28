package com.example.tst.service.impl;

import com.baomidou.mybatisplus.plugins.Page;
import com.example.tst.entity.SysRole;
import com.example.tst.mapper.SysRoleMapper;
import com.example.tst.service.SysRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @Author: SuZhenpeng
 * Description:
 * Date: Created in 9:55 2017/11/23
 * @Modified By:
 */
@Transactional
@Service
public class SysRoleServiceImpl implements SysRoleService {

    @Autowired
    SysRoleMapper SysRoleMapper;
    @Override
    public Page<SysRole> GetRoleList(Page page, String searchName) {

        page.setRecords(SysRoleMapper.GetRoleList(page,searchName));
        return page;
    }

    @Override
    public int saveOrUpdateRole(SysRole sysRole) {

        if("".equals(sysRole.getRoleId()) ||sysRole.getRoleId()==null){
            return SysRoleMapper.saveRole(sysRole);
        }else{
            return SysRoleMapper.updateRole(sysRole);
        }

    }

    @Override
    public int delRole(String ids) {
        String[] idList=ids.split(",");
        return SysRoleMapper.delRole(idList);
    }
}
