package ax.kl.service.impl;

import ax.kl.entity.TreeModel;
import com.baomidou.mybatisplus.plugins.Page;
import ax.kl.common.TreeUtil;
import ax.kl.entity.SysMenu;
import ax.kl.mapper.SysMenuMapper;
import ax.kl.service.SysMenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * @Author: SuZhenpeng
 * Description:
 * Date: Created in 11:03 2017/11/13
 * @Modified By:
 */
@Transactional
@Service
public class SysMenuServiceImpl implements SysMenuService {

    @Autowired
    SysMenuMapper SysMenuMapper;

    @Override
    public Page<SysMenu> GetMenuList(Page page, String parentId, String searchName) {
        page.setRecords(SysMenuMapper.GetMenuList(page,parentId,searchName));
        return page;
    }
    @Override
    public List<TreeModel> getMenuTrueList(){
        return TreeUtil.getTree(SysMenuMapper.getMenuTreeList());
    }

    @Override
    public List<SysMenu> GetMenusList(){
        return SysMenuMapper.GetMenusList();
    }

    @Override
    public String  saveOrUpdateMenu(SysMenu menu) {
        if("".equals(menu.getMenuId()) ||menu.getMenuId()==null){
            String MenuId= UUID.randomUUID().toString();
            menu.setMenuId(MenuId);
            menu.setMenuOrder(Integer.toString(this.SysMenuMapper.getMaxOrder()));
            this.SysMenuMapper.saveMenu(menu);
            return MenuId;
        }else{
            this.SysMenuMapper.updateMenu(menu);
            return "";
        }


    }
    @Override
    public int deleteMenus(String[] list){

        if(SysMenuMapper.getMenuType(list).size()==0)
        {
            this.SysMenuMapper.deleteMenus(list);
            return 1;
        }

        return 0;

    }

    @Override
    public String moveOrder(String type, SysMenu menu) {
        List<SysMenu> menuList= SysMenuMapper.getOrder(menu.getParentMenuId(),type,menu.getMenuOrder());

        if(menuList.size()>0){

            SysMenu menuM=menuList.get(0);
            SysMenuMapper.upDateOrderSort(menuM.getMenuId(),menu.getMenuOrder(),menu.getMenuId(),menuM.getMenuOrder());


            return "0";
        }

        if("up".equals(type)){
            return "1";
        }else{
            return "2";
        }
    }

}
