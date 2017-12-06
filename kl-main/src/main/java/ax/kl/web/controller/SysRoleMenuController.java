package ax.kl.web.controller;

import ax.kl.entity.SysRoleMenu;
import ax.kl.service.SysRoleMenuService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@Controller
@RequestMapping("/ManagerRoleMenu")
@Api(value = "/ManagerRoleMenu", tags = {"角色可管理菜单"})
public class SysRoleMenuController {
    @Autowired
    SysRoleMenuService RoleMenuService;

    @ApiOperation(value = "获取角色菜单页面")
    @RequestMapping(value = "/RoleMenu", method = RequestMethod.GET)
    public String doView() {
        return "/SysRoleMenu/SysRoleMenu";
    }

    @ApiOperation(value = "角色权限获取树列表")
    @RequestMapping(value = "/getRoleMenuTreeList", method = RequestMethod.POST)
    @ResponseBody
    public List<SysRoleMenu> getMenuTreeList(@RequestParam String role) {
        List<SysRoleMenu> list = RoleMenuService.getRoleMenuTreeList(role);
        return list;
    }

    @ApiOperation(value = "保存角色菜单")
    @RequestMapping(value = "/saveRoleMenu", method = RequestMethod.POST)
    @ResponseBody
    public boolean saveRoleMenu(@RequestParam String role, @RequestParam String menu) {
        String[] m = menu.split(",");
        if (role == null || role.equals("")) {
            return false;
        }
        boolean del = RoleMenuService.delRoleMenuByRoleId(role, m);
        return del;
    }
}
