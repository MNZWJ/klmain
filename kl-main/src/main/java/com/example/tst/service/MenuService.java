package com.example.tst.service;

import com.baomidou.mybatisplus.plugins.Page;
import com.example.tst.entity.DataDict;
import com.example.tst.entity.Menu;
import com.example.tst.entity.TreeModel;

import java.util.List;

/**
 * @Author: SuZhenpeng
 * Description:
 * Date: Created in 11:01 2017/11/13
 * @Modified By:
 */
public interface MenuService {
    /**
     * 获取菜单列表
     * @return
     */
    Page<Menu> GetMenuList(Page page,String parentId,String searchName);

    /**
     * 获取树列表
     * @return
     */
    List<TreeModel> getMenuTrueList();

    /**
     * 获取菜单列表
     * @return
     */
    List<Menu> GetMenusList();
    /**
     * 新增或更新菜单
     */
    String saveOrUpdateMenu( Menu menu);

    /**
     * 删除菜单
     */
    int deleteMenus(String[] ids);

    /**
     * 移动节点
     * @param type
     * @param menu
     * @return
     */
    String moveOrder(String type,Menu menu);

}
