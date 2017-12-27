package ax.kl.web.controller;

import ax.f4j.model.JsonResult;
import ax.f4j.model.ResultUtil;
import ax.kl.entity.EquipType;
import ax.kl.entity.TreeModel;
import ax.kl.service.EquipTypeService;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.plugins.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 设备类型
 * @author wangbiao
 */
@Controller
@CrossOrigin
@Api(value = "/EquipType",tags = "设备类型")
@RequestMapping("/EquipType")
public class EquipTypeController {

    @Autowired
    EquipTypeService equipTypeService;

    @RequestMapping(value = "/Index",method = RequestMethod.GET)
    @ApiOperation("设备类型维护")
    public String doView(){
        return "/EquipType/EquipType";
    }

    @RequestMapping(value = "/getEquipTypeTreeList",method = RequestMethod.GET)
    @ApiOperation("获取设备类型树")
    @ResponseBody
    public List<TreeModel> getEquipTypeTreeList(){
        return equipTypeService.getEquipTypeTreeList();
    }

    @ApiOperation("获取设备类型列表")
    @RequestMapping(value = "/getEquipTypeTable")
    @ResponseBody
    public Map<String,Object> getEquipTypeTable(@RequestParam Map<String,String> param){
        Map<String,Object> map =new HashMap<>(2);
        int pageSize = Integer.parseInt(param.get("pageSize"));
        int pageNumber = Integer.parseInt(param.get("pageNumber"));
        String parentId = param.get("nodeId");
        Page page=new Page();
        page.setCurrent(pageNumber);
        page.setSize(pageSize);
        Page<EquipType> list =equipTypeService.getEquipTypeTable(page,parentId);
        map.put("total",list.getTotal());
        map.put("rows",list.getRecords());
        return map;
    }

    @ApiOperation("新增设备类型")
    @RequestMapping(value = "/saveEquipType",method = RequestMethod.POST)
    @ResponseBody
    public boolean saveEquipType(@RequestBody EquipType equipType){
        return equipTypeService.saveEquip(equipType)==1;
    }

    @ApiOperation("删除设备类型")
    @RequestMapping(value = "/deleteEquip",method = RequestMethod.POST)
    @ResponseBody
    public void deleteEquip(@RequestParam String ids){
        equipTypeService.deleteEquip(ids);
    }

    @ApiOperation("设备类型编码校验")
    @RequestMapping(value = "/validateTypeCode",method = RequestMethod.POST)
    @ResponseBody
    public JSONObject validateTypeCode(@RequestParam Map<String,String> param){
        String typecode = param.get("typeCode");
        boolean result = equipTypeService.validateTypeCode(typecode);
        JSONObject obj=new JSONObject();
        obj.put("valid",result);
        return obj;
    }


    @ApiOperation(value = "设备排序")
    @RequestMapping(value = "/moveOrder", method = RequestMethod.POST)
    @ResponseBody
    public JsonResult moveOrder(@RequestParam Map<String,String> map) {
        String code= equipTypeService.removeOrder(map);
        if("0".equals(code)){
            return ResultUtil.error(00,"移动成功!");
        }else if("1".equals(code)){
            return ResultUtil.error(01,"当前已是第一条数据！");
        }
        return ResultUtil.error(02,"当前已是最后一条数据！");
    }

    @ApiOperation(value = "设备类型")
    @RequestMapping(value = "/getEquipType", method = RequestMethod.GET)
    @ResponseBody
    public List<Map<String,String>> getEquipType() {
        return equipTypeService.getEquipType();
    }
}
