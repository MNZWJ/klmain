package com.example.tst.web.controller;


import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.plugins.Page;
import ax.f4j.model.JsonResult;
import ax.f4j.model.ResultUtil;
import com.example.tst.entity.Menu;
import com.example.tst.entity.TreeModel;
import com.example.tst.service.MenuService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Author: SuZhenpeng
 * Description:
 * Date: Created in 11:14 2017/11/13
 * @Modified By:
 */
@CrossOrigin
@Controller

@RequestMapping("/menu")
@Api(value = "/menu", tags = {"菜单"})
public class MenuController {
    @Autowired
    MenuService MenuService;


    @ApiOperation(value = "获取菜单列表")
    @RequestMapping(value = "/menuList", method = RequestMethod.GET)
    @ResponseBody
    public Map<String,Object>  getMenuList(@RequestParam Map<String,String> paraMap,@RequestParam String parentId,@RequestParam String searchName) {

        int pageSize=Integer.parseInt(paraMap.get("pageSize"));
        int pageNumber=Integer.parseInt(paraMap.get("pageNumber"));
        Page page=new Page();
        page.setCurrent(pageNumber);
        page.setSize(pageSize);

        Page<Menu> list = MenuService.GetMenuList(page,parentId,searchName);
        Map<String,Object> map=new HashMap<>();
        map.put("total",list.getTotal());
        map.put("rows",list.getRecords());
        return map ;
    }

    @ApiOperation(value = "获取树列表")
    @RequestMapping(value = "/getMenuTreeList", method = RequestMethod.POST)
    @ResponseBody
    public List<TreeModel> getMenuTreeList() {

        List<TreeModel> list = MenuService.getMenuTrueList();
        return list;
    }

    @ApiOperation(value = "保存菜单")
    @RequestMapping(value = "/saveMenu", method = RequestMethod.POST)
    @ResponseBody
    public JsonResult saveMenu(@RequestBody Menu menu) {

        String MenuId=this.MenuService.saveOrUpdateMenu(menu);
        return ResultUtil.success(MenuId);
    }

    @ApiOperation(value = "删除菜单")
    @RequestMapping(value = "/deleteMenus", method = RequestMethod.POST)
    @ResponseBody
    public JsonResult deleteMenus(@RequestParam String ids) {
        String[] idList= ids.split(",");
        if(this.MenuService.deleteMenus(idList)==1){
            return ResultUtil.success("111");
        }
        return ResultUtil.error(01,"字典下有子字典！");
    }



    @ApiOperation(value = "获取菜单页面")
    @RequestMapping(value="/MenuView",method=RequestMethod.GET)
    public String doView () {
        return "Menu/index";
    }

    @ApiOperation(value = "菜单排序")
    @RequestMapping(value = "/moveOrder", method = RequestMethod.POST)
    @ResponseBody
    public JsonResult moveOrder(@RequestParam String type,@RequestParam String dataDictStr) {

        JSONObject jsonObject=JSONObject.parseObject(dataDictStr);
        Menu menu=(Menu)JSONObject.toJavaObject(jsonObject,Menu.class);
        String code= MenuService.moveOrder(type,menu);

        if("0".equals(code)){
            return ResultUtil.error(00,"移动成功!");
        }else if("1".equals(code)){
            return ResultUtil.error(01,"当前已是第一条数据！");
        }

        return ResultUtil.error(02,"当前已是最后一条数据！");
    }

}
