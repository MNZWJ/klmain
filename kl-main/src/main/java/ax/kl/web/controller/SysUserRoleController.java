package ax.kl.web.controller;

import ax.kl.entity.SysUserRole;
import ax.kl.service.SysUserRoleService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
/**
 * @author maxiaolong
 * 人员角色管理
 */
@CrossOrigin
@Controller
@RequestMapping("/UserRole")
@Api(value =  "/UserRole",tags = "人员角色管理")
public class SysUserRoleController {

    @Autowired
    SysUserRoleService UserRoleService;

    @ApiOperation(value = "人员角色菜单维护页面")
    @RequestMapping(value="/UserRole",method= RequestMethod.GET)
    public String doView(){
        return "/SysUserRole/UserRole";
    }


    @RequestMapping(value = "/updateOrAddUserRole",method= RequestMethod.POST)
    @ApiOperation(value = "保存数据")
    @ResponseBody
    public boolean updateOrAddUserRole(@RequestParam String role,@RequestParam String menu) {
        String[] m=role.split(",");//m右侧角色
        if(menu==null||menu.equals("")){
            return false;
        }
        boolean del=UserRoleService.delRoleMenuByRoleId(menu,m);/*//menu左侧人员树，m右侧角色，可多选*/
        return del;
    }
    @ApiOperation(value = "获取人员ID对应的角色")
    @RequestMapping(value = "/GetRoleInfo",method = RequestMethod.GET)
    @ResponseBody
    public List<SysUserRole> GetRoleInfo(@RequestParam String id ){
        return UserRoleService.getRoleInfo(id);
    }

}
