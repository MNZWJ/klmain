package ax.kl.web.controller;


import ax.f4j.model.JsonResult;
import ax.f4j.model.ResultUtil;
import ax.kl.common.ConstantData;
import ax.kl.common.DESEncryptTools;
import ax.kl.common.PublicTools;
import ax.kl.common.SessionUserData;
import ax.kl.entity.LoginInfo;
import ax.kl.entity.SysBusinessUser;
import ax.kl.entity.SysMenu;
import ax.kl.entity.SysUser;
import ax.kl.service.*;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import javax.servlet.http.HttpSession;
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

    @Autowired
    SysUserService SysUserService;
    @Autowired
    SysBusinessUserService SysBusinessUserService;
    @Autowired
    SysRoleUserService SysRoleUserService;
    @Autowired
    SysRoleMenuService SysRoleMenuService;

    @ApiOperation(value = "加载登录页面")
    @RequestMapping(value="/Index",method= RequestMethod.GET)
    public String Index () {
        return  "Login/Index";
    }

    @ApiOperation(value = "跳转的error页面")
    @RequestMapping(value="/error",method= RequestMethod.GET)
    public String error () {
        return  "Login/error";
    }

    @ApiOperation(value = "登录")
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public JsonResult login(@RequestParam String loginName,@RequestParam String pwd,HttpSession httpSession){
        loginName = PublicTools.decodeBase64(loginName);
        pwd = PublicTools.decodeBase64(pwd);

        //根据登录名获取用户的登录信息
        SysUser sysUser = this.SysUserService.getUserInfoByLoginName(loginName);
        if(null == sysUser){
            return ResultUtil.error(01,"用户名不存在！");
        }
        //验证密码是否正确
        String encryPwd = PublicTools.byteArr2HexStr(DESEncryptTools.encrypt(pwd.getBytes()));
        if(encryPwd.equalsIgnoreCase(sysUser.getPassWord())){//密码正确
            LoginInfo loginInfo = this.SysBusinessUserService.getUserInfo(sysUser.getBusinessUserId());
            if(null == loginInfo){
                return ResultUtil.error(01,"用户信息不存在！");
            }
            //往Session中存储用户信息
            SessionUserData suerData = new SessionUserData();
            suerData.setUserId(loginInfo.getUserId());
            suerData.setUserName(loginInfo.getUserName());
            suerData.setOrgId(loginInfo.getOrgId());
            suerData.setOrgName(loginInfo.getOrgName());
            suerData.setOrgType(loginInfo.getOrgType());
            if(ConstantData.DeptTypeId.equalsIgnoreCase(loginInfo.getOrgType())){
                String orgCode = loginInfo.getOrgCode().substring(0,loginInfo.getOrgCode().length()-3);
                suerData.setOrgCode(orgCode);
            }else{
                suerData.setOrgCode(loginInfo.getOrgCode());
            }
            //人员角色
            String roleId = this.SysRoleUserService.getRoleByUserId(loginInfo.getUserId());
            suerData.setRoleId(roleId);
            httpSession.setAttribute("sessionuser",suerData);
            //往Session中存储权限菜单
            List<SysMenu> menuLists = this.SysRoleMenuService.getMenusByRoleId(roleId.split(","));
            httpSession.setAttribute("MenuList",menuLists);
        }else{
            return ResultUtil.error(01,"密码错误！");
        }
        return ResultUtil.success("登录成功！");
    }



}
