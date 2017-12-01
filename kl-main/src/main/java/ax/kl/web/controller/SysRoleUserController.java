package ax.kl.web.controller;

import ax.kl.entity.SysRoleUser;
import ax.kl.entity.TreeModel;
import ax.kl.service.SysRoleUserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@Controller
@RequestMapping("/ManagerRoleUser")
@Api(value = "/ManagerRoleUser", tags = {"角色可管理人员"})
public class SysRoleUserController {

    @Autowired
    SysRoleUserService SysRoleUserService;

    @ApiOperation(value = "角色可管理人员")
    @RequestMapping(value="/RoleUser",method= RequestMethod.GET)
    public String doView () {
        return "/SysRoleUser/SysRoleUser";
    }

    @ApiOperation(value = "获取树列表")
    @RequestMapping(value = "/getUserTreeList", method = RequestMethod.POST)
    @ResponseBody
    public List<TreeModel> getMenuTreeList() {
        List<TreeModel> UserTree=SysRoleUserService.getUserTreeList();
        return UserTree;
    }

    @ApiOperation(value = "获取角色人员")
    @RequestMapping(value = "/getRoleUser",method = RequestMethod.GET)
    @ResponseBody
    public List<SysRoleUser> getRoleUser(@RequestParam String role){
        return SysRoleUserService.getRoleUser(role);
    }

    @ApiOperation(value = "更新角色人员")
    @RequestMapping(value = "/saveRoleUser",method = RequestMethod.POST)
    @ResponseBody
    public boolean updateRoleUser(@RequestParam String RoleId,@RequestParam String UserId){
        String User[]=UserId.split(",");
        return SysRoleUserService.updateRoleUser(RoleId,User);
    }
}
