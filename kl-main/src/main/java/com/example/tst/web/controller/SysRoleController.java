package com.example.tst.web.controller;

import com.baomidou.mybatisplus.plugins.Page;
import ax.f4j.model.JsonResult;
import ax.f4j.model.ResultUtil;
import com.example.tst.entity.SysRole;
import com.example.tst.service.SysRoleService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * @Author: SuZhenpeng
 * Description:
 * Date: Created in 9:19 2017/11/23
 * @Modified By:
 */

@CrossOrigin
@Controller
@RequestMapping("/SysRole")
@Api(value = "/SysRole",tags = {"角色"})
public class SysRoleController {

    @Autowired
    SysRoleService SysRoleService;

    @RequestMapping(value = "/Index",method = RequestMethod.GET)
    @ApiOperation(value = "视图")
    public String doView(){
        return "/SysRole/SysRole";
    }


    @RequestMapping(value = "/GetRoleList",method = RequestMethod.GET)
    @ApiOperation(value = "加载表格数据")
    @ResponseBody
    public Map<String, Object> GetRoleList(@RequestParam Map<String,String> map){
        int pageSize=Integer.parseInt(map.get("pageSize"));
        int pageNumber=Integer.parseInt(map.get("pageNumber"));
        Page page=new Page();
        page.setCurrent(pageNumber);
        page.setSize(pageSize);

        Page<SysRole> list = SysRoleService.GetRoleList(page,map.get("roleSearchName"));
        Map<String,Object> rmap=new HashMap<>();
        rmap.put("total",list.getTotal());
        rmap.put("rows",list.getRecords());
        return rmap;
    }

    @RequestMapping(value = "/saveOrUpdateRole",method = RequestMethod.POST)
    @ApiOperation(value = "保存角色")
    @ResponseBody
    public JsonResult saveOrUpdateRole(@RequestBody SysRole sysRole){

        return ResultUtil.success(SysRoleService.saveOrUpdateRole(sysRole));
    }

    @RequestMapping(value = "/delRole",method = RequestMethod.POST)
    @ApiOperation(value = "删除角色")
    @ResponseBody
    public JsonResult delRole(@RequestParam("ids") String ids){
        return ResultUtil.success(SysRoleService.delRole(ids));
    }

}
