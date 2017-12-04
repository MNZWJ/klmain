package ax.kl.web.controller;

import ax.kl.entity.SysOrganise;
import ax.kl.entity.TreeModel;
import ax.kl.service.SysBusinessUserService;
import ax.f4j.model.JsonResult;
import ax.f4j.model.ResultUtil;
import com.baomidou.mybatisplus.plugins.Page;
import ax.kl.entity.SysBusinessUser;
import ax.kl.service.SysOrganiseService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RequestMapping("/SysBusinessUser")
@Api(value = "/SysBusinessUser",tags ={"人员维护"})
@Controller
public class SysBusinessUserController {

    @Autowired
    private SysOrganiseService sysOrganiseService;

    @Autowired
    private SysBusinessUserService sysBusinessUserService;

    @RequestMapping(value = "/Index",method= RequestMethod.GET)
    @ApiOperation(value = "获取人员维护页面")
    public String doView(){
        return "SysBusinessUser/BusinessUser";
    }


    /**
     * 获取组织机构树并获取所有岗位类型将其传到前端
     */
    @RequestMapping(value = "/getSysOrganiseTreeList",method= RequestMethod.POST)
    @ApiOperation(value = "获取组织机构树")
    @ResponseBody
    public Map<String,Object> getSysOrganiseTreeList(){

        Map<String,Object> map=new HashMap();
        //获取组织机构树
        List<TreeModel> tm=sysOrganiseService.getSysOrganiseTreeList();

        //获取所有的可显的组织机构信息
        List<SysOrganise> sysOrganises=sysOrganiseService.getAllSysOrganises();
        map.put("syss",sysOrganises);

        map.put("tm",tm);
        return map;
    }


    @ApiOperation(value = "获取对应机构的人员列表")
    @RequestMapping(value = "/getBusinessUserList", method = RequestMethod.GET)
    @ResponseBody
    public Map<String,Object> getSysOrganiseList(@RequestParam Map<String,String> paraMap) {
        //获取传来的值
        int pageSize=Integer.parseInt(paraMap.get("pageSize"));
        int pageNumber=Integer.parseInt(paraMap.get("pageNumber"));
        String typeCode=paraMap.get("typeCode");
        String searchName=paraMap.get("searchName");
        Page page=new Page();
        page.setCurrent(pageNumber);
        page.setSize(pageSize);
        //根据好多的id和searchName来进行条件查询
        Page<SysOrganise> list = sysBusinessUserService.getBusinessUserList(page,typeCode,searchName);
        Map<String,Object> map=new HashMap<>(3);
        map.put("total",list.getTotal());
        map.put("rows",list.getRecords());
        return map ;
    }



    @RequestMapping(value = "/updateOrAddBusinessUser",method= RequestMethod.POST)
    @ApiOperation(value = "保存数据")
    @ResponseBody
    public JsonResult updateOrAddBusinessUser(HttpServletRequest request, @RequestBody SysBusinessUser businessUser){
        String result= sysBusinessUserService.updateOrAddBusinessUser(request,businessUser);
        return ResultUtil.success(result);
    }


    @RequestMapping(value = "/deleteBusinessUser",method= RequestMethod.POST)
    @ApiOperation(value = "删除数据")
    @ResponseBody
    public JsonResult deleteBusinessUser(@RequestParam String ids){
        String[] idLists=ids.split(",");
        //直接删除
        this.sysBusinessUserService.deleteBusinessUser(idLists);
        return ResultUtil.success(00);
    }

    @RequestMapping(value = "/checkLoginName",method= RequestMethod.POST)
    @ApiOperation(value = "检查登录名唯一性")
    @ResponseBody
    public JsonResult checkLoginName(@RequestParam("loginName")String loginName){
        return ResultUtil.success(sysBusinessUserService.checkLoginName(loginName));
    }

}
