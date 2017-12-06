package ax.kl.web.controller;

import ax.kl.entity.SysOrganise;
import ax.f4j.model.JsonResult;
import ax.f4j.model.ResultUtil;
import com.baomidou.mybatisplus.plugins.Page;
import ax.kl.entity.SysDataDict;
import ax.kl.entity.TreeModel;
import ax.kl.service.SysOrganiseService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@Api(value="/SysOrganise", tags = {"组织机构维护"})
@RequestMapping("/SysOrganise")
public class SysOrganiseController {

    @Autowired
    private SysOrganiseService sysOrganiseService;

    @RequestMapping(value = "/Index",method= RequestMethod.GET)
    @ApiOperation(value = "获取组织机构维护页面")
    public String doView(){
        return "SysOrganise/SysOrganise";
    }


    @RequestMapping(value = "/getSysOrganiseTreeList",method= RequestMethod.POST)
    @ApiOperation(value = "获取组织机构树")
    @ResponseBody
    public Map<String,Object> getSysOrganiseTreeList(){
        //获取组织机构类型
        List<SysDataDict> lists= sysOrganiseService.getDataDictByTypeId();
        Map<String,Object> map=new HashMap<>();
        map.put("data",lists);
        List<TreeModel> tm=sysOrganiseService.getSysOrganiseTreeList();
        map.put("tm",tm);
        return map;
    }


    @RequestMapping(value = "/updateOrAddSysOrganise",method= RequestMethod.POST)
    @ApiOperation(value = "保存数据")
    @ResponseBody
    public JsonResult updateOrAddSysOrganise(@RequestBody SysOrganise sysOrganise){
        String result=sysOrganiseService.updateOrAddSysOrganise(sysOrganise);
        return ResultUtil.success(result);
    }

    @RequestMapping(value = "/deleteSysOrganise",method= RequestMethod.POST)
    @ApiOperation(value = "删除数据")
    @ResponseBody
    public JsonResult deleteSysOrganise(@RequestParam String ids){
        String[] idLists=ids.split(",");
        if(this.sysOrganiseService.deleteSysOrganises(idLists)==1){
            return ResultUtil.success("111");
        }
        return ResultUtil.error(01,"您选中的机构下有子机构或人员，不可删除");
    }

    @ApiOperation(value = "获取组织机构列表")
    @RequestMapping(value = "/getSysOrganiseList", method = RequestMethod.GET)
    @ResponseBody
    public Map<String,Object> getSysOrganiseList(@RequestParam Map<String,String> paraMap, @RequestParam String typeId, @RequestParam String searchName) {

        int pageSize=Integer.parseInt(paraMap.get("pageSize"));
        int pageNumber=Integer.parseInt(paraMap.get("pageNumber"));
        Page page=new Page();
        page.setCurrent(pageNumber);
        page.setSize(pageSize);

        Page<SysOrganise> list = sysOrganiseService.getSysOrganiseList(page,typeId,searchName);
        Map<String,Object> map=new HashMap<>();
        map.put("total",list.getTotal());
        map.put("rows",list.getRecords());
        return map ;
    }

//    @RequestMapping(value = "/moveOrder",method= RequestMethod.POST)
//    @ApiOperation(value = "移动数据位置")
//    @ResponseBody
//    public JsonResult moveOrder(@RequestParam String type,@RequestParam String sysOrgStr){
//        JSONObject jsonObject=JSONObject.parseObject(sysOrgStr);
//        SysOrganise sysOrganise=(SysOrganise)JSONObject.toJavaObject(jsonObject,SysOrganise.class);
//        String code=sysOrganiseService.moveOrder(type,sysOrganise);
//
//        if(code.equals("0")){
//            return ResultUtil.error(00,"移动成功!");
//        }else if(code.equals("1")){
//            return ResultUtil.error(01,"当前已是第一条数据！");
//        }
//
//        return ResultUtil.error(02,"当前已是最后一条数据！");
//    }


}
