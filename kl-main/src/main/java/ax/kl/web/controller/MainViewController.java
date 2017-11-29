package ax.kl.web.controller;



import ax.kl.entity.SysMenu;
import ax.kl.service.SysMenuService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @Author: SuZhenpeng
 * Description:
 * Date: Created in 9:33 2017/11/15
 * @Modified By:
 */
@CrossOrigin
@Controller
@RequestMapping("/MainView")
@Api(value="/MainView",tags={"主页"})
public class MainViewController {


    @Autowired
    SysMenuService SysMenuService;

    @ApiOperation(value = "获取主页面")
    @RequestMapping(value="/Index",method= RequestMethod.GET)
    public String doView (Model model) {
        List<SysMenu> menuList= SysMenuService.GetMenusList();
        List<SysMenu> rootMenu=menuList.stream().filter(s-> "1".equals(s.getMenuLevel())).collect(Collectors.toList());
        Map<String,List<SysMenu>> secondMenu=menuList.stream().filter(s-> "2".equals(s.getMenuLevel())).collect(Collectors.groupingBy(SysMenu::getParentMenuId));
        model.addAttribute("rootMenu",rootMenu);
        model.addAttribute("secondMenu",secondMenu);
        return  "MainView/Index";
    }

}
