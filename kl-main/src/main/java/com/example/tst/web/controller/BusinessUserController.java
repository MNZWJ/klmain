package com.example.tst.web.controller;

import ax.f4j.model.JsonResult;
import ax.f4j.model.ResultUtil;
import com.baomidou.mybatisplus.plugins.Page;
import com.example.tst.entity.BusinessUser;
import com.example.tst.entity.SysOrganise;
import com.example.tst.entity.TreeModel;
import com.example.tst.entity.WorkTypeInfo;
import com.example.tst.service.BusinessUserService;
import com.example.tst.service.SysOrganiseService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@CrossOrigin
@RequestMapping("/BusinessUser")
@Api(value = "/BusinessUser",tags ={"人员维护"})
@Controller
public class BusinessUserController {

    @Autowired
    private SysOrganiseService sysOrganiseService;

    @Autowired
    private BusinessUserService businessUserService;

    @RequestMapping(value = "/Index",method= RequestMethod.GET)
    @ApiOperation(value = "获取人员维护页面")
    public String doView(){
        return "BusinessUser/BusinessUser";
    }


    //获取组织机构树并获取所有岗位类型将其传到前端
    @RequestMapping(value = "/getSysOrganiseTreeList",method= RequestMethod.POST)
    @ApiOperation(value = "获取组织机构树")
    @ResponseBody
    public Map<String,Object> getSysOrganiseTreeList(){

        Map<String,Object> map=new HashMap();
        //获取组织机构树
        List<TreeModel> tm=sysOrganiseService.getSysOrganiseTreeList();
        //获取岗位类型
        List<WorkTypeInfo> workTypeInfos=businessUserService.getWorkTypeInfo();
        //获取所有的可显的组织机构信息
        List<SysOrganise> sysOrganises=sysOrganiseService.getAllSysOrganises();
        map.put("syss",sysOrganises);
        map.put("data",workTypeInfos);
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
        Page<SysOrganise> list = businessUserService.getBusinessUserList(page,typeCode,searchName);
        Map<String,Object> map=new HashMap<>();
        map.put("total",list.getTotal());
        map.put("rows",list.getRecords());
        return map ;
    }



    @RequestMapping(value = "/updateOrAddBusinessUser",method= RequestMethod.POST)
    @ApiOperation(value = "保存数据")
    @ResponseBody
    public JsonResult updateOrAddBusinessUser(HttpServletRequest request, @RequestBody BusinessUser businessUser){
        String result=businessUserService.updateOrAddBusinessUser(request,businessUser);
        return ResultUtil.success(result);
    }


    @RequestMapping(value = "/deleteBusinessUser",method= RequestMethod.POST)
    @ApiOperation(value = "删除数据")
    @ResponseBody
    public JsonResult deleteBusinessUser(@RequestParam String ids){
        String[] idLists=ids.split(",");
        //直接删除
        this.businessUserService.deleteBusinessUser(idLists);
        return ResultUtil.success(00);
    }
}
