package com.example.tst.mapper;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.example.tst.entity.SysRole;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author: SuZhenpeng
 * Description:
 * Date: Created in 9:47 2017/11/23
 * @Modified By:
 */
@Repository
public interface SysRoleMapper extends BaseMapper<SysRole> {
    /**
     * 获取角色列表
     * @param page
     * @param searchName
     * @return
     */
    List<SysRole> GetRoleList(Page page, @Param("searchName")String searchName);

    /**
     * 保存角色
     * @param sysRole
     * @return
     */
    int saveRole(SysRole sysRole);


    /**
     * 更新角色
     * @param sysRole
     * @return
     */
    int updateRole(SysRole sysRole);


    /**
     * 删除角色
     * @param ids
     * @return
     */
    int delRole(String[] ids);


}
