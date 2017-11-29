package ax.kl.service.impl;

import ax.kl.entity.TreeModel;
import com.baomidou.mybatisplus.plugins.Page;
import ax.kl.common.TreeUtil;
import ax.kl.entity.Menu;
import ax.kl.mapper.MenuMapper;
import ax.kl.service.MenuService;
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
public class MenuServiceImpl implements MenuService {

    @Autowired
    MenuMapper MenuMapper;

    @Override
    public Page<Menu> GetMenuList(Page page,String parentId,String searchName) {
        page.setRecords(MenuMapper.GetMenuList(page,parentId,searchName));
        return page;
    }
    @Override
    public List<TreeModel> getMenuTrueList(){
        return TreeUtil.getTree(MenuMapper.getMenuTreeList());
    }

    @Override
    public List<Menu> GetMenusList(){
        return MenuMapper.GetMenusList();
    }

    @Override
    public String  saveOrUpdateMenu(Menu menu) {
        if("".equals(menu.getMenuId()) ||menu.getMenuId()==null){
            String MenuId= UUID.randomUUID().toString();
            menu.setMenuId(MenuId);
            menu.setMenuOrder(Integer.toString(this.MenuMapper.getMaxOrder()));
            this.MenuMapper.saveMenu(menu);
            return MenuId;
        }else{
            this.MenuMapper.updateMenu(menu);
            return "";
        }


    }
    @Override
    public int deleteMenus(String[] list){

        if(MenuMapper.getMenuType(list).size()==0)
        {
            this.MenuMapper.deleteMenus(list);
            return 1;
        }

        return 0;

    }

    @Override
    public String moveOrder(String type, Menu menu) {
        List<Menu> menuList= MenuMapper.getOrder(menu.getParentMenuId(),type,menu.getMenuOrder());

        if(menuList.size()>0){

            Menu menuM=menuList.get(0);
            MenuMapper.upDateOrderSort(menuM.getMenuId(),menu.getMenuOrder(),menu.getMenuId(),menuM.getMenuOrder());


            return "0";
        }

        if("up".equals(type)){
            return "1";
        }else{
            return "2";
        }
    }

}
