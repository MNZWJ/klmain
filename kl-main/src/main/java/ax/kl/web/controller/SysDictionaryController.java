package ax.kl.web.controller;

import ax.kl.common.Auth;
import ax.kl.entity.SysDataDict;
import ax.kl.entity.TreeModel;
import ax.kl.service.SysDictionaryService;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.plugins.Page;
import ax.f4j.model.JsonResult;
import ax.f4j.model.ResultUtil;

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
 * Date: Created in 14:18 2017/11/17
 * @Modified By:
 */
@Auth
@CrossOrigin
@Controller
@RequestMapping("/SysDictionary")
@Api(value = "/SysDictionary",tags = {"数据字典"})
public class SysDictionaryController {

    @Autowired
    SysDictionaryService SysDictionaryService;

    @RequestMapping(value = "/Index",method= RequestMethod.GET)
    @ApiOperation(value = "获取数据字典页面")
    public String doView(){
        return "SysDictionary/Dictionary";
    }

    @ApiOperation(value = "获取字典列表")
    @RequestMapping(value = "/getDictList", method = RequestMethod.GET)
    @ResponseBody
    public Map<String,Object> getDictList(@RequestParam Map<String,String> paraMap, @RequestParam String typeId, @RequestParam String dictSearchName) {



        int pageSize=Integer.parseInt(paraMap.get("pageSize"));
        int pageNumber=Integer.parseInt(paraMap.get("pageNumber"));
        Page page=new Page();
        page.setCurrent(pageNumber);
        page.setSize(pageSize);

        Page<SysDataDict> list = SysDictionaryService.GetDictList(page,typeId,dictSearchName);
        Map<String,Object> map=new HashMap<>();
        map.put("total",list.getTotal());
        map.put("rows",list.getRecords());
        return map ;
    }

    @ApiOperation(value = "获取字典树")
    @RequestMapping(value = "/getDictTreeList", method = RequestMethod.POST)
    @ResponseBody
    public List<TreeModel> getDictTreeList(){
        List<TreeModel> list = SysDictionaryService.getDictTreeList();
        return list;
    }

    @ApiOperation(value = "保存字典")
    @RequestMapping(value = "/saveDict", method = RequestMethod.POST)
    @ResponseBody
    public JsonResult saveDict(@RequestBody SysDataDict dataDict) {

        String dictId=this.SysDictionaryService.saveDict(dataDict);
        return ResultUtil.success(dictId);
    }

    @ApiOperation(value = "删除字典")
    @RequestMapping(value = "/deleteDicts", method = RequestMethod.POST)
    @ResponseBody
    public JsonResult deleteMenus(@RequestParam String ids) {
        String[] idList= ids.split(",");
        if(this.SysDictionaryService.deleteDicts(idList)==1){
            return ResultUtil.success("111");
        }
        return ResultUtil.error(01,"字典下有子字典！");
    }

    @ApiOperation(value = "字典排序")
    @RequestMapping(value = "/moveOrder", method = RequestMethod.POST)
    @ResponseBody
    public JsonResult moveOrder(@RequestParam String type,@RequestParam String dataDictStr) {

        JSONObject jsonObject=JSONObject.parseObject(dataDictStr);
        SysDataDict dataDict=(SysDataDict)JSONObject.toJavaObject(jsonObject,SysDataDict.class);
        String code= SysDictionaryService.moveOrder(type,dataDict);

        if("0".equals(code)){
            return ResultUtil.error(00,"移动成功!");
        }else if("1".equals(code)){
            return ResultUtil.error(01,"当前已是第一条数据！");
        }

        return ResultUtil.error(02,"当前已是最后一条数据！");
    }


    @ApiOperation(value="加载字典内容")
    @RequestMapping(value = "/getDataDictList",method = RequestMethod.GET)
    @ResponseBody
    public List<SysDataDict> getDataDictList(@RequestParam String typeId){
        List<SysDataDict> a=SysDictionaryService.getDataDictList(typeId);
        return a;
    }


}
