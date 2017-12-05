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
 * @Author: XUM
 * Description:
 * Date: Created in 9:33 2017/12/4
 * @Modified By:
 */
@CrossOrigin
@Controller
@RequestMapping("/Login")
@Api(value="/Login",tags={"登录页"})
public class LoginController {

    @ApiOperation(value = "加载登录页面")
    @RequestMapping(value="/Index",method= RequestMethod.GET)
    public String Index () {
        return  "Login/Index";
    }



}
